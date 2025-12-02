/**
 * Modiva - Image Compressor
 * Image compression with quality optimization
 * @module services/image/compressor
 */
import { imageService } from './image.services.js';
import { ImageUploadConstants } from '../../config/constants.js';
import { Logger } from '../../utils/logger.js';
/**
 * Compression Options
 */
const defaultCompressionOptions = {
    maxWidth: ImageUploadConstants.MAX_WIDTH,
    maxHeight: ImageUploadConstants.MAX_HEIGHT,
    quality: ImageUploadConstants.QUALITY,
    outputType: ImageUploadConstants.OUTPUT_FORMAT,
    maintainAspectRatio: true,
    autoOrient: true
};
/**
 * Image Compressor Class
 */
export class ImageCompressor {
    constructor(options = {}) {
        this.options = { ...defaultCompressionOptions, ...options };
    }
    /**
     * Compress image file
     * @param {File} file - Image file to compress
     * @param {object} options - Compression options
     * @returns {Promise<Blob>} - Compressed image blob
     */
    async compress(file, options = {}) {
        const opts = { ...this.options, ...options };
        Logger.info('🗜️ Starting image compression...', {
            originalSize: `${(file.size / 1024).toFixed(2)} KB`,
            options: opts
        });
        try {
            // Load image
            const img = await imageService.loadImage(file);
            // Get original dimensions
            const originalWidth = img.width;
            const originalHeight = img.height;
            // Calculate new dimensions
            const newDimensions = imageService.calculateDimensions(
                originalWidth,
                originalHeight,
                opts.maxWidth,
                opts.maxHeight
            );
            Logger.debug('Image dimensions:', {
                original: `${originalWidth}x${originalHeight}`,
                compressed: `${newDimensions.width}x${newDimensions.height}`
            });
            // Create canvas with new dimensions
            const canvas = imageService.createCanvas(
                img,
                newDimensions.width,
                newDimensions.height
            );
            // Convert to blob
            const blob = await imageService.canvasToBlob(
                canvas,
                opts.outputType,
                opts.quality
            );
            // Log compression results
            const compressionRatio = ((1 - blob.size / file.size) * 100).toFixed(2);
            Logger.success('✅ Image compressed successfully', {
                originalSize: `${(file.size / 1024).toFixed(2)} KB`,
                compressedSize: `${(blob.size / 1024).toFixed(2)} KB`,
                compressionRatio: `${compressionRatio}%`,
                dimensions: `${newDimensions.width}x${newDimensions.height}`
            });
            return blob;
        } catch (error) {
            Logger.error('❌ Image compression failed:', error);
            throw new Error('Failed to compress image: ' + error.message);
        }
    }
    /**
     * Compress with progressive quality
     * Automatically adjust quality to meet target size
     * @param {File} file - Image file
     * @param {number} targetSizeKB - Target size in KB
     * @param {object} options - Compression options
     * @returns {Promise<Blob>}
     */
    async compressToSize(file, targetSizeKB, options = {}) {
        const opts = { ...this.options, ...options };
        let quality = opts.quality;
        let blob = null;
        let attempts = 0;
        const maxAttempts = 5;
        Logger.info(`🎯 Compressing to target size: ${targetSizeKB} KB`);
        while (attempts < maxAttempts) {
            attempts++;
            blob = await this.compress(file, { ...opts, quality });
            const sizeKB = blob.size / 1024;
            if (sizeKB <= targetSizeKB) {
                Logger.success(`✅ Achieved target size in ${attempts} attempts`);
                break;
            }
            // Reduce quality for next attempt
            quality *= 0.8;
            Logger.debug(`Attempt ${attempts}: ${sizeKB.toFixed(2)} KB (quality: ${quality.toFixed(2)})`);
        }
        return blob;
    }
    /**
     * Compress multiple images
     * @param {File[]} files - Array of image files
     * @param {object} options - Compression options
     * @returns {Promise<Array>} - Array of compressed blobs
     */
    async compressMultiple(files, options = {}) {
        Logger.info(`📦 Compressing ${files.length} images...`);
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            Logger.info(`Processing ${i + 1}/${files.length}: ${file.name}`);
            try {
                const blob = await this.compress(file, options);
                results.push({
                    success: true,
                    file,
                    blob,
                    originalSize: file.size,
                    compressedSize: blob.size
                });
            } catch (error) {
                Logger.error(`Failed to compress ${file.name}:`, error);
                results.push({
                    success: false,
                    file,
                    error
                });
            }
        }
        const successCount = results.filter(r => r.success).length;
        Logger.success(`✅ Compressed ${successCount}/${files.length} images successfully`);
        return results;
    }
    /**
     * Get optimal quality for file size
     * @param {File} file - Image file
     * @param {number} targetSizeKB - Target size in KB
     * @returns {Promise<number>} - Optimal quality (0-1)
     */
    async getOptimalQuality(file, targetSizeKB) {
        let minQuality = 0.1;
        let maxQuality = 1.0;
        let optimalQuality = 0.7;
        const tolerance = 0.05; // 5% tolerance
        Logger.info('🔍 Finding optimal quality...');
        for (let i = 0; i < 10; i++) {
            const testQuality = (minQuality + maxQuality) / 2;
            const blob = await this.compress(file, { quality: testQuality });
            const sizeKB = blob.size / 1024;
            const diff = Math.abs(sizeKB - targetSizeKB) / targetSizeKB;
            Logger.debug(`Test quality ${testQuality.toFixed(2)}: ${sizeKB.toFixed(2)} KB`);
            if (diff <= tolerance) {
                optimalQuality = testQuality;
                break;
            }
            if (sizeKB > targetSizeKB) {
                maxQuality = testQuality;
            } else {
                minQuality = testQuality;
            }
            optimalQuality = testQuality;
        }
        Logger.success(`✅ Optimal quality found: ${optimalQuality.toFixed(2)}`);
        return optimalQuality;
    }
    /**
     * Create progressive compression (multiple quality levels)
     * @param {File} file - Image file
     * @param {number[]} qualities - Array of quality levels
     * @returns {Promise<Array>} - Array of compressed blobs
     */
    async createProgressive(file, qualities = [0.9, 0.7, 0.5, 0.3]) {
        Logger.info('📊 Creating progressive compression...');
        const results = [];
        for (const quality of qualities) {
            const blob = await this.compress(file, { quality });
            results.push({
                quality,
                blob,
                size: blob.size,
                sizeKB: (blob.size / 1024).toFixed(2)
            });
        }
        return results;
    }
    /**
     * Compress with different output formats
     * @param {File} file - Image file
     * @param {string[]} formats - Array of formats to try
     * @returns {Promise<object>} - Best compression result
     */
    async compressWithFormats(file, formats = ['image/jpeg', 'image/webp', 'image/png']) {
        Logger.info('🔄 Testing different formats...');
        const results = [];
        for (const format of formats) {
            try {
                const blob = await this.compress(file, { outputType: format });
                results.push({
                    format,
                    blob,
                    size: blob.size,
                    sizeKB: (blob.size / 1024).toFixed(2)
                });
            } catch (error) {
                Logger.warn(`Format ${format} not supported:`, error);
            }
        }
        // Find smallest
        const best = results.reduce((min, current) => 
            current.size < min.size ? current : min
        );
        Logger.success(`✅ Best format: ${best.format} (${best.sizeKB} KB)`);
        return best;
    }
    /**
     * Compress with smart quality detection
     * Analyzes image complexity and adjusts quality
     * @param {File} file - Image file
     * @returns {Promise<Blob>}
     */
    async smartCompress(file) {
        Logger.info('🧠 Smart compression...');
        const img = await imageService.loadImage(file);
        
        // Calculate image complexity (simplified)
        const pixelCount = img.width * img.height;
        const fileSize = file.size;
        const bytesPerPixel = fileSize / pixelCount;
        // Adjust quality based on complexity
        let quality = this.options.quality;
        if (bytesPerPixel > 3) {
            // High complexity image (lots of details)
            quality = Math.min(quality, 0.85);
        } else if (bytesPerPixel < 1) {
            // Low complexity image (simple graphics)
            quality = Math.max(quality, 0.6);
        }
        Logger.info(`Detected complexity: ${bytesPerPixel.toFixed(2)} bytes/pixel, using quality: ${quality}`);
        return await this.compress(file, { quality });
    }
    /**
     * Get compression info
     * @param {File} original - Original file
     * @param {Blob} compressed - Compressed blob
     * @returns {object}
     */
    getCompressionInfo(original, compressed) {
        const compressionRatio = ((1 - compressed.size / original.size) * 100).toFixed(2);
        const sizeSaved = original.size - compressed.size;
        return {
            originalSize: original.size,
            originalSizeFormatted: `${(original.size / 1024).toFixed(2)} KB`,
            compressedSize: compressed.size,
            compressedSizeFormatted: `${(compressed.size / 1024).toFixed(2)} KB`,
            sizeSaved,
            sizeSavedFormatted: `${(sizeSaved / 1024).toFixed(2)} KB`,
            compressionRatio: `${compressionRatio}%`,
            compressionRatioNumeric: parseFloat(compressionRatio)
        };
    }
}
/**
 * Create singleton instance
 */
export const imageCompressor = new ImageCompressor();
export default imageCompressor;