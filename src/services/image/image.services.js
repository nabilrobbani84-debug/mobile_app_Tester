/**
 * Modiva - Base Image Service
 * Core image service for handling image operations
 * @module services/image/image.service
 */
import { ImageUploadConstants } from '../../config/constants.js';
import { Logger } from '../../utils/logger.js';
/**
 * Image Metadata Interface
 */
class ImageMetadata {
    constructor(file) {
        this.name = file.name;
        this.size = file.size;
        this.type = file.type;
        this.lastModified = file.lastModified;
        this.width = null;
        this.height = null;
        this.aspectRatio = null;
    }
    /**
     * Update dimensions
     * @param {number} width - Image width
     * @param {number} height - Image height
     */
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
        this.aspectRatio = width / height;
    }
    /**
     * Get formatted size
     * @returns {string}
     */
    getFormattedSize() {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = this.size;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
    /**
     * Get info object
     * @returns {object}
     */
    getInfo() {
        return {
            name: this.name,
            size: this.size,
            sizeFormatted: this.getFormattedSize(),
            type: this.type,
            width: this.width,
            height: this.height,
            aspectRatio: this.aspectRatio,
            lastModified: new Date(this.lastModified).toISOString()
        };
    }
}
/**
 * Base Image Service Class
 */
export class ImageService {
    constructor() {
        this.config = ImageUploadConstants;
        this.supportedFormats = this.config.ACCEPTED_FORMATS;
        this.maxSize = this.config.MAX_SIZE_BYTES;
        this.maxWidth = this.config.MAX_WIDTH;
        this.maxHeight = this.config.MAX_HEIGHT;
        this.quality = this.config.QUALITY;
        this.outputFormat = this.config.OUTPUT_FORMAT;
    }
    /**
     * Read file as Data URL
     * @param {File} file - File object
     * @returns {Promise<string>} - Data URL
     */
    readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                Logger.error('Failed to read file:', error);
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }
    /**
     * Read file as ArrayBuffer
     * @param {File} file - File object
     * @returns {Promise<ArrayBuffer>}
     */
    readAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                Logger.error('Failed to read file:', error);
                reject(new Error('Failed to read file'));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Load image from File or Data URL
     * @param {File|string} source - File object or Data URL
     * @returns {Promise<HTMLImageElement>}
     */
    async loadImage(source) {
        return new Promise(async (resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (error) => {
                Logger.error('Failed to load image:', error);
                reject(new Error('Failed to load image'));
            };
            if (source instanceof File) {
                const dataURL = await this.readAsDataURL(source);
                img.src = dataURL;
            } else if (typeof source === 'string') {
                img.src = source;
            } else {
                reject(new Error('Invalid image source'));
            }
        });
    }
    /**
     * Get image metadata
     * @param {File} file - Image file
     * @returns {Promise<ImageMetadata>}
     */
    async getMetadata(file) {
        const metadata = new ImageMetadata(file);
        try {
            const img = await this.loadImage(file);
            metadata.setDimensions(img.width, img.height);
            Logger.debug('Image metadata:', metadata.getInfo());
        } catch (error) {
            Logger.error('Failed to get image metadata:', error);
        }
        return metadata;
    }
    /**
     * Create canvas from image
     * @param {HTMLImageElement} img - Image element
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {HTMLCanvasElement}
     */
    createCanvas(img, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        return canvas;
    }
    /**
     * Canvas to Blob
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {string} type - Output type
     * @param {number} quality - Quality (0-1)
     * @returns {Promise<Blob>}
     */
    canvasToBlob(canvas, type = this.outputFormat, quality = this.quality) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert canvas to blob'));
                    }
                },
                type,
                quality
            );
        });
    }
    /**
     * Blob to File
     * @param {Blob} blob - Blob object
     * @param {string} filename - File name
     * @returns {File}
     */
    blobToFile(blob, filename = 'image.jpg') {
        return new File([blob], filename, { type: blob.type });
    }
    /**
     * Data URL to Blob
     * @param {string} dataURL - Data URL
     * @returns {Blob}
     */
    dataURLToBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    /**
     * Blob to Data URL
     * @param {Blob} blob - Blob object
     * @returns {Promise<string>}
     */
    blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    }
    /**
     * Calculate new dimensions while maintaining aspect ratio
     * @param {number} width - Original width
     * @param {number} height - Original height
     * @param {number} maxWidth - Max width
     * @param {number} maxHeight - Max height
     * @returns {object} - New dimensions
     */
    calculateDimensions(width, height, maxWidth = this.maxWidth, maxHeight = this.maxHeight) {
        let newWidth = width;
        let newHeight = height;
        // Scale down if width exceeds max
        if (newWidth > maxWidth) {
            newHeight *= maxWidth / newWidth;
            newWidth = maxWidth;
        }
        // Scale down if height exceeds max
        if (newHeight > maxHeight) {
            newWidth *= maxHeight / newHeight;
            newHeight = maxHeight;
        }
        return {
            width: Math.round(newWidth),
            height: Math.round(newHeight)
        };
    }
    /**
     * Rotate image
     * @param {HTMLImageElement} img - Image element
     * @param {number} degrees - Rotation degrees (90, 180, 270)
     * @returns {HTMLCanvasElement}
     */
    rotateImage(img, degrees) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Set canvas dimensions based on rotation
        if (degrees === 90 || degrees === 270) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        // Rotate and draw
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        return canvas;
    }
    /**
     * Flip image
     * @param {HTMLImageElement} img - Image element
     * @param {string} direction - 'horizontal' or 'vertical'
     * @returns {HTMLCanvasElement}
     */
    flipImage(img, direction = 'horizontal') {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (direction === 'horizontal') {
            ctx.scale(-1, 1);
            ctx.drawImage(img, -img.width, 0);
        } else {
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, -img.height);
        }
        return canvas;
    }
    /**
     * Crop image
     * @param {HTMLImageElement} img - Image element
     * @param {object} crop - Crop coordinates {x, y, width, height}
     * @returns {HTMLCanvasElement}
     */
    cropImage(img, crop) {
        const canvas = document.createElement('canvas');
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            img,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );
        return canvas;
    }
    /**
     * Apply filter to image
     * @param {HTMLImageElement} img - Image element
     * @param {string} filter - CSS filter string
     * @returns {HTMLCanvasElement}
     */
    applyFilter(img, filter) {
        const canvas = this.createCanvas(img, img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);
        return canvas;
    }
    /**
     * Convert image to grayscale
     * @param {HTMLImageElement} img - Image element
     * @returns {HTMLCanvasElement}
     */
    toGrayscale(img) {
        return this.applyFilter(img, 'grayscale(100%)');
    }
    /**
     * Adjust image brightness
     * @param {HTMLImageElement} img - Image element
     * @param {number} value - Brightness value (0-200, 100 = normal)
     * @returns {HTMLCanvasElement}
     */
    adjustBrightness(img, value) {
        return this.applyFilter(img, `brightness(${value}%)`);
    }
    /**
     * Adjust image contrast
     * @param {HTMLImageElement} img - Image element
     * @param {number} value - Contrast value (0-200, 100 = normal)
     * @returns {HTMLCanvasElement}
     */
    adjustContrast(img, value) {
        return this.applyFilter(img, `contrast(${value}%)`);
    }
    /**
     * Get image dominant color
     * @param {HTMLImageElement} img - Image element
     * @returns {string} - RGB color
     */
    getDominantColor(img) {
        const canvas = this.createCanvas(img, 1, 1);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const pixel = imageData.data;
        return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    }
    /**
     * Create thumbnail
     * @param {File} file - Image file
     * @param {number} size - Thumbnail size
     * @returns {Promise<Blob>}
     */
    async createThumbnail(file, size = 200) {
        const img = await this.loadImage(file);
        const dimensions = this.calculateDimensions(img.width, img.height, size, size);
        const canvas = this.createCanvas(img, dimensions.width, dimensions.height);
        return await this.canvasToBlob(canvas);
    }
    /**
     * Batch process images
     * @param {File[]} files - Array of image files
     * @param {Function} processor - Processing function
     * @returns {Promise<Array>}
     */
    async batchProcess(files, processor) {
        const results = [];
        for (const file of files) {
            try {
                const result = await processor(file);
                results.push({ success: true, file, result });
            } catch (error) {
                Logger.error(`Failed to process ${file.name}:`, error);
                results.push({ success: false, file, error });
            }
        }
        return results;
    }
    /**
     * Get service info
     * @returns {object}
     */
    getInfo() {
        return {
            supportedFormats: this.supportedFormats,
            maxSize: this.maxSize,
            maxSizeFormatted: `${(this.maxSize / 1024 / 1024).toFixed(2)} MB`,
            maxWidth: this.maxWidth,
            maxHeight: this.maxHeight,
            quality: this.quality,
            outputFormat: this.outputFormat
        };
    }
}
/**
 * Create singleton instance
 */
export const imageService = new ImageService();
export default imageService;