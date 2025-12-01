/**
 * Modiva - Logger Utility
 * Advanced logging utility with levels and formatting
 * @module utils/logger
 */
import { AppConfig } from '../config/app.config.js';
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
/**
 * Log Level Names
 */
const LogLevelNames = {
    [LogLevels.TRACE]: 'TRACE',
    [LogLevels.DEBUG]: 'DEBUG',
    [LogLevels.INFO]: 'INFO',
    [LogLevels.WARN]: 'WARN',
    [LogLevels.ERROR]: 'ERROR',
    [LogLevels.FATAL]: 'FATAL'
};
/**
 * Log Level Colors (for console)
 */
const LogLevelColors = {
    [LogLevels.TRACE]: '#6b7280',
    [LogLevels.DEBUG]: '#8b5cf6',
    [LogLevels.INFO]: '#3b82f6',
    [LogLevels.WARN]: '#f59e0b',
    [LogLevels.ERROR]: '#ef4444',
    [LogLevels.FATAL]: '#dc2626'
};
/**
 * Logger Class
 */
export class LoggerClass {
    constructor() {
        this.level = this.parseLogLevel(AppConfig.logging.level);
        this.enabled = AppConfig.logging.enabled;
        this.useConsole = AppConfig.logging.console;
        this.remoteLogging = AppConfig.logging.remote;
        this.remoteUrl = AppConfig.logging.remoteUrl;
        this.logs = [];
        this.maxLogs = 1000;
    }
    /**
     * Parse log level from string
     * @param {string} levelStr - Log level string
     * @returns {number} - Log level number
     */
    parseLogLevel(levelStr) {
        const upperLevel = levelStr.toUpperCase();
        return LogLevels[upperLevel] !== undefined ? LogLevels[upperLevel] : LogLevels.INFO;
    }
    /**
     * Set log level
     * @param {string|number} level - Log level
     */
    setLevel(level) {
        if (typeof level === 'string') {
            this.level = this.parseLogLevel(level);
        } else if (typeof level === 'number') {
            this.level = level;
        }
    }
    /**
     * Check if level is enabled
     * @param {number} level - Log level
     * @returns {boolean}
     */
    isLevelEnabled(level) {
        return this.enabled && level >= this.level;
    }
    /**
     * Format log message
     * @param {number} level - Log level
     * @param {array} args - Log arguments
     * @returns {object} - Formatted log object
     */
    formatLog(level, args) {
        const timestamp = new Date();
        const levelName = LogLevelNames[level] || 'UNKNOWN';
        
        return {
            timestamp,
            level,
            levelName,
            message: args.map(arg => this.stringify(arg)).join(' '),
            args,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
    }
    /**
     * Stringify value
     * @param {*} value - Value to stringify
     * @returns {string}
     */
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
    /**
     * Log message
     * @param {number} level - Log level
     * @param {array} args - Arguments to log
     */
    log(level, ...args) {
        if (!this.isLevelEnabled(level)) return;
        const logEntry = this.formatLog(level, args);
        // Store log
        this.storeLogs(logEntry);
        // Console output
        if (this.useConsole) {
            this.logToConsole(logEntry);
        }
        // Remote logging
        if (this.remoteLogging && this.remoteUrl) {
            this.logToRemote(logEntry);
        }
    }
    /**
     * Store logs in memory
     * @param {object} logEntry - Log entry
     */
    storeLogs(logEntry) {
        this.logs.push(logEntry);
        // Keep only last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }
    /**
     * Log to console
     * @param {object} logEntry - Log entry
     */
    logToConsole(logEntry) {
        const { level, levelName, timestamp, args } = logEntry;
        const color = LogLevelColors[level];
        const timeStr = timestamp.toLocaleTimeString();
        const prefix = `%c[${levelName}]%c ${timeStr}`;
        const styles = [
            `color: ${color}; font-weight: bold;`,
            'color: #6b7280;'
        ];
        switch (level) {
            case LogLevels.TRACE:
            case LogLevels.DEBUG:
                console.debug(prefix, ...styles, ...args);
                break;
            case LogLevels.INFO:
                console.info(prefix, ...styles, ...args);
                break;
            case LogLevels.WARN:
                console.warn(prefix, ...styles, ...args);
                break;
            case LogLevels.ERROR:
            case LogLevels.FATAL:
                console.error(prefix, ...styles, ...args);
                break;
            default:
                console.log(prefix, ...styles, ...args);
        }
    }
    /**
     * Log to remote server
     * @param {object} logEntry - Log entry
     */
    async logToRemote(logEntry) {
        try {
            await fetch(this.remoteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });
        } catch (error) {
            // Fail silently to avoid infinite loop
            console.error('Remote logging failed:', error);
        }
    }
    /**
     * Trace log
     * @param {...*} args - Arguments to log
     */
    trace(...args) {
        this.log(LogLevels.TRACE, ...args);
    }
    /**
     * Debug log
     * @param {...*} args - Arguments to log
     */
    debug(...args) {
        this.log(LogLevels.DEBUG, ...args);
    }
    /**
     * Info log
     * @param {...*} args - Arguments to log
     */
    info(...args) {
        this.log(LogLevels.INFO, ...args);
    }
    /**
     * Success log (alias for info with emoji)
     * @param {...*} args - Arguments to log
     */
    success(...args) {
        this.log(LogLevels.INFO, ...args);
    }
    /**
     * Warn log
     * @param {...*} args - Arguments to log
     */
    warn(...args) {
        this.log(LogLevels.WARN, ...args);
    }
    /**
     * Error log
     * @param {...*} args - Arguments to log
     */
    error(...args) {
        this.log(LogLevels.ERROR, ...args);
    }
    /**
     * Fatal log
     * @param {...*} args - Arguments to log
     */
    fatal(...args) {
        this.log(LogLevels.FATAL, ...args);
    }
    /**
     * Group logs
     * @param {string} label - Group label
     */
    group(label) {
        if (this.useConsole) {
            console.group(label);
        }
    }
    /**
     * Group logs (collapsed)
     * @param {string} label - Group label
     */
    groupCollapsed(label) {
        if (this.useConsole) {
            console.groupCollapsed(label);
        }
    }
    /**
     * End group
     */
    groupEnd() {
        if (this.useConsole) {
            console.groupEnd();
        }
    }
    /**
     * Table log
     * @param {*} data - Data to display as table
     */
    table(data) {
        if (this.useConsole && this.isLevelEnabled(LogLevels.INFO)) {
            console.table(data);
        }
    }
    /**
     * Time start
     * @param {string} label - Timer label
     */
    time(label) {
        if (this.useConsole && this.isLevelEnabled(LogLevels.DEBUG)) {
            console.time(label);
        }
    }
    /**
     * Time end
     * @param {string} label - Timer label
     */
    timeEnd(label) {
        if (this.useConsole && this.isLevelEnabled(LogLevels.DEBUG)) {
            console.timeEnd(label);
        }
    }
    /**
     * Get all logs
     * @returns {array} - Array of log entries
     */
    getLogs() {
        return [...this.logs];
    }
    /**
     * Get logs by level
     * @param {number} level - Log level
     * @returns {array} - Filtered logs
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
        if (this.useConsole) {
            console.clear();
        }
    }
    /**
     * Export logs
     * @returns {string} - JSON string of logs
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
    /**
     * Download logs as file
     */
    downloadLogs() {
        const logsJson = this.exportLogs();
        const blob = new Blob([logsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `modiva-logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
/**
 * Create singleton logger instance
 */
export const Logger = new LoggerClass();
/**
 * Freeze log levels
 */
Object.freeze(LogLevels);
export default Logger;