/**
 * Modiva - Logger Utility
 * Advanced logging utility with levels and formatting
 * @module utils/logger
 */

import { Platform, Share } from 'react-native';
// FIX: Import Default karena AppConfig diexport sebagai default
import AppConfig from '../config/app.config.js';

/**
 * Log Levels
 */
export const LogLevels = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
    OFF: 99
};

const LogLevelNames = {
    [LogLevels.TRACE]: 'TRACE',
    [LogLevels.DEBUG]: 'DEBUG',
    [LogLevels.INFO]: 'INFO',
    [LogLevels.WARN]: 'WARN',
    [LogLevels.ERROR]: 'ERROR',
    [LogLevels.FATAL]: 'FATAL'
};

/**
 * Logger Class
 */
export class LoggerClass {
    constructor() {
        // FIX: Fallback aman jika config logging belum ada di AppConfig
        const logConfig = AppConfig.logging || {};

        this.level = this.parseLogLevel(logConfig.level || 'INFO');
        this.enabled = logConfig.enabled !== false; // Default true
        this.useConsole = logConfig.console !== false;
        this.remoteLogging = logConfig.remote || false;
        this.remoteUrl = logConfig.remoteUrl || '';
        this.logs = [];
        this.maxLogs = 1000;
    }

    parseLogLevel(levelStr) {
        if (!levelStr) return LogLevels.INFO;
        const upperLevel = String(levelStr).toUpperCase();
        return LogLevels[upperLevel] !== undefined ? LogLevels[upperLevel] : LogLevels.INFO;
    }

    setLevel(level) {
        if (typeof level === 'string') {
            this.level = this.parseLogLevel(level);
        } else if (typeof level === 'number') {
            this.level = level;
        }
    }

    isLevelEnabled(level) {
        return this.enabled && level >= this.level;
    }

    formatLog(level, args) {
        const timestamp = new Date();
        const levelName = LogLevelNames[level] || 'UNKNOWN';
        
        // FIX: Hapus window.location (Web API) ganti dengan Platform info
        return {
            timestamp,
            level,
            levelName,
            message: args.map(arg => this.stringify(arg)).join(' '),
            args,
            platform: `${Platform.OS} v${Platform.Version}`, // Info OS HP
            userAgent: 'ModivaApp/1.0' // Hardcode user agent untuk mobile
        };
    }

    stringify(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return value;
        if (typeof value === 'number' || typeof value === 'boolean') return String(value);
        if (value instanceof Error) return `${value.name}: ${value.message}\n${value.stack}`;
        
        try {
            return JSON.stringify(value, null, 2);
        } catch (e) {
            return String(value);
        }
    }

    log(level, ...args) {
        if (!this.isLevelEnabled(level)) return;
        const logEntry = this.formatLog(level, args);
        
        this.storeLogs(logEntry);
        
        if (this.useConsole) {
            this.logToConsole(logEntry);
        }
        
        if (this.remoteLogging && this.remoteUrl) {
            this.logToRemote(logEntry);
        }
    }

    storeLogs(logEntry) {
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    logToConsole(logEntry) {
        const { level, levelName, timestamp, args } = logEntry;
        const timeStr = timestamp.toLocaleTimeString();
        const prefix = `[${levelName}] ${timeStr}:`;

        // FIX: Console React Native tidak support CSS styling (%c) dengan baik
        // Kita gunakan console method standar tanpa styling warna CSS
        switch (level) {
            case LogLevels.TRACE:
            case LogLevels.DEBUG:
                console.debug(prefix, ...args);
                break;
            case LogLevels.INFO:
                console.info(prefix, ...args);
                break;
            case LogLevels.WARN:
                console.warn(prefix, ...args);
                break;
            case LogLevels.ERROR:
            case LogLevels.FATAL:
                console.error(prefix, ...args);
                break;
            default:
                console.log(prefix, ...args);
        }
    }

    async logToRemote(logEntry) {
        try {
            // Menggunakan fetch standar (kompatibel RN)
            await fetch(this.remoteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });
        } catch (error) {
            // Silent fail agar logger tidak bikin loop error
            if (__DEV__) console.log('Remote logging failed (silent)');
        }
    }

    trace(...args) { this.log(LogLevels.TRACE, ...args); }
    debug(...args) { this.log(LogLevels.DEBUG, ...args); }
    info(...args) { this.log(LogLevels.INFO, ...args); }
    success(...args) { this.log(LogLevels.INFO, '✅', ...args); }
    warn(...args) { this.log(LogLevels.WARN, ...args); }
    error(...args) { this.log(LogLevels.ERROR, ...args); }
    fatal(...args) { this.log(LogLevels.FATAL, ...args); }

    // Grouping: Support terbatas di RN, gunakan wrapper sederhana
    group(label) { if (__DEV__) console.log(`--- GROUP: ${label} ---`); }
    groupCollapsed(label) { this.group(label); }
    groupEnd() { if (__DEV__) console.log(`--- END GROUP ---`); }

    table(data) {
        if (this.useConsole && this.isLevelEnabled(LogLevels.INFO)) {
            // console.table sering bug di Hermes, gunakan JSON stringify
            console.log('TABLE DATA:', JSON.stringify(data, null, 2));
        }
    }

    time(label) { if (__DEV__ && console.time) console.time(label); }
    timeEnd(label) { if (__DEV__ && console.timeEnd) console.timeEnd(label); }

    getLogs() { return [...this.logs]; }
    getLogsByLevel(level) { return this.logs.filter(log => log.level === level); }
    
    clearLogs() {
        this.logs = [];
    }

    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * FIX: Download Logs untuk Mobile
     * Di Web kita bisa buat elemen <a> dan download. Di Mobile TIDAK BISA.
     * Kita ganti menjadi fitur SHARE menggunakan native share sheet.
     */
    async downloadLogs() {
        try {
            const logsJson = this.exportLogs();
            if (logsJson.length === 0) return;

            // Membuka dialog share bawaan Android/iOS
            await Share.share({
                message: logsJson,
                title: 'Modiva Application Logs'
            });
        } catch (error) {
            console.error('Failed to share logs:', error);
        }
    }
}

export const Logger = new LoggerClass();
Object.freeze(LogLevels);
export default Logger;