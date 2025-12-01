/**
 * Modiva - Image Validator
 * Validation for image uploads
 * @module services/image/validator
 */
import { ImageUploadConstants } from '../../config/constants.js';
import { Logger } from '../../utils/logger.js';
/**
 * Validation Error Class
 */
export class ImageValidationError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ImageValidationError';
        this.code = code;
    }
}
/**
 * Image Validator Class
 */
export class ImageValidator {
    constructor() {
        this.config = ImageUploadConstants;
        this.maxSize = this.config.MAX_SIZE_BYTES;
        this.acceptedFormats = this.config.ACCEPTED_FORMATS;
        this.acceptedExtensions = this.config.ACCEPTED_EXTENSIONS;
    }
    /**
     * Validate file type
     * @param {File} file - File to validate
     * @returns {boolean}
     * @throws {ImageValidationError}
     */
    validateType(file) {
        if (!file.type) {
            throw new ImageValidationError(
                'File type tidak dapat dideteksi',
                'INVALID_TYPE'
            );
        }
        if (!this.acceptedFormats.includes(file.type)) {
            throw new ImageValidationError(
                `Format file tidak didukung. Hanya ${this.acceptedExtensions.join(', ')} yang diperbolehkan`,
                'UNSUPPORTED_FORMAT'
            );
        }
        Logger.debug('✅ File type valid:', file.type);
        return true;
    }
    /**
     * Validate file size
     * @param {File} file - File to validate
     * @returns {boolean}
     * @throws {ImageValidationError}
     */
    validateSize(file) {
        if (file.size > this.maxSize) {
            const maxSizeMB = (this.maxSize / 1024 / 1024).toFixed(2);
            const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
            throw new ImageValidationError(
                `Ukuran file terlalu besar (${fileSizeMB} MB). Maksimal ${maxSizeMB} MB`,
                'FILE_TOO_LARGE'
            );
        }
        if (file.size === 0) {
            throw new ImageValidationError(
                'File kosong atau rusak',
                'EMPTY_FILE'
            );
        }
        Logger.debug('✅ File size valid:', `${(file.size / 1024).toFixed(2)} KB`);
        return true;
    }
    /**
     * Validate file extension
     * @param {File} file - File to validate
     * @returns {boolean}
     * @throws {ImageValidationError}
     */
    validateExtension(file) {
        const fileName = file.name.toLowerCase();
        const hasValidExtension = this.acceptedExtensions.some(ext => 
            fileName.endsWith(ext)
        );
        if (!hasValidExtension) {
            throw new ImageValidationError(
                `Ekstensi file tidak valid. Hanya ${this.acceptedExtensions.join(', ')} yang diperbolehkan`,
                'INVALID_EXTENSION'
            );
        }
        Logger.debug('✅ File extension valid');
        return true;
    }
    /**
     * Validate image dimensions
     * @param {HTMLImageElement} img - Image element
     * @param {object} options - Dimension constraints
     * @returns {boolean}
     * @throws {ImageValidationError}
     */
    validateDimensions(img, options = {}) {
        const {
            minWidth = 0,
            minHeight = 0,
            maxWidth = Infinity,
            maxHeight = Infinity,
            aspectRatio = null
        } = options;
        if (img.width < minWidth || img.height < minHeight) {
            throw new ImageValidationError(
                `Dimensi gambar terlalu kecil. Minimal ${minWidth}x${minHeight}px`,
                'DIMENSIONS_TOO_SMALL'
            );
        }
        if (img.width > maxWidth || img.height > maxHeight) {
            throw new ImageValidationError(
                `Dimensi gambar terlalu besar. Maksimal ${maxWidth}x${maxHeight}px`,
                'DIMENSIONS_TOO_LARGE'
            );
        }
        if (aspectRatio) {
            const imgAspectRatio = img.width / img.height;
            const tolerance = 0.1;
            if (Math.abs(imgAspectRatio - aspectRatio) > tolerance) {
                throw new ImageValidationError(
                    `Aspect ratio tidak sesuai. Diharapkan ${aspectRatio}`,
                    'INVALID_ASPECT_RATIO'
                );
            }
        }
        Logger.debug('✅ Image dimensions valid:', `${img.width}x${img.height}`);
        return true;
    }
    /**
     * Validate file name
     * @param {string} fileName - File name
     * @param {object} options - Validation options
     * @returns {boolean}
     * @throws {ImageValidationError}
     */
    validateFileName(fileName, options = {}) {
        const {
            maxLength = 255,
            allowSpaces = true,
            allowSpecialChars = false
        } = options;
        if (fileName.length > maxLength) {
            throw new ImageValidationError(
                `Nama file terlalu panjang. Maksimal ${maxLength} karakter`,
                'FILENAME_TOO_LONG'
            );
        }
        if (!allowSpaces && fileName.includes(' ')) {
            throw new ImageValidationError(
                'Nama file tidak boleh mengandung spasi',
                'FILENAME_HAS_SPACES'
            );
        }
        if (!allowSpecialChars) {
            const specialCharsRegex = /[^a-zA-Z0-9._-]/;
            if (specialCharsRegex.test(fileName.replace(/\s/g, ''))) {
                throw new ImageValidationError(
                    'Nama file mengandung karakter tidak valid',
                    'INVALID_FILENAME_CHARS'
                );
            }
        }
        Logger.debug('✅ File name valid');
        return true;
    }
    /**
     * Validate complete file
     * @param {File} file - File to validate
     * @param {object} options - Validation options
     * @returns {Promise<boolean>}
     * @throws {ImageValidationError}
     */
    async validate(file, options = {}) {
        Logger.info('🔍 Validating image file:', file.name);
        try {
            // Validate basic file properties
            this.validateType(file);
            this.validateSize(file);
            this.validateExtension(file);
            if (options.validateFileName !== false) {
                this.validateFileName(file.name, options.fileNameOptions);
            }
            // Validate dimensions if required
            if (options.validateDimensions) {
                const img = await this.loadImage(file);
                this.validateDimensions(img, options.dimensionOptions);
            }
            Logger.success('✅ Image validation passed');
            return true;
        } catch (error) {
            Logger.error('❌ Image validation failed:', error.message);
            throw error;
        }
    }
    /**
     * Validate multiple files
     * @param {FileList|File[]} files - Files to validate
     * @param {object} options - Validation options
     * @returns {Promise<object>} - Validation results
     */
    async validateMultiple(files, options = {}) {
        const results = {
            valid: [],
            invalid: [],
            totalSize: 0
        };
        const fileArray = Array.from(files);
        Logger.info(`🔍 Validating ${fileArray.length} files...`);
        for (const file of fileArray) {
            try {
                await this.validate(file, options);
                results.valid.push(file);
                results.totalSize += file.size;
            } catch (error) {
                results.invalid.push({
                    file,
                    error: error.message,
                    code: error.code
                });
            }
        }
        Logger.info(`✅ Validation complete: ${results.valid.length} valid, ${results.invalid.length} invalid`);
        return results;
    }
    /**
     * Load image for dimension validation
     * @param {File} file - Image file
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }
    /**
     * Check if file is image
     * @param {File} file - File to check
     * @returns {boolean}
     */
    isImage(file) {
        return file.type.startsWith('image/');
    }
    /**
     * Get validation errors as user-friendly messages
     * @param {Error} error - Validation error
     * @returns {string}
     */
    getErrorMessage(error) {
        if (error instanceof ImageValidationError) {
            return error.message;
        }
        return 'Terjadi kesalahan saat validasi gambar';
    }
    /**
     * Get file info
     * @param {File} file - File object
     * @returns {object}
     */
    getFileInfo(file) {
        return {
            name: file.name,
            size: file.size,
            sizeFormatted: `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type,
            lastModified: new Date(file.lastModified).toISOString()
        };
    }
    /**
     * Get validation rules
     * @returns {object}
     */
    getValidationRules() {
        return {
            maxSize: this.maxSize,
            maxSizeFormatted: `${(this.maxSize / 1024 / 1024).toFixed(2)} MB`,
            acceptedFormats: this.acceptedFormats,
            acceptedExtensions: this.acceptedExtensions
        };
    }
}
/**
 * Create singleton instance
 */
export const imageValidator = new ImageValidator();
export default imageValidator;
