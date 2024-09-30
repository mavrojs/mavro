"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.Debug = void 0;
const colors_1 = __importDefault(require("colors"));
class Debug {
    /**
     * Logs an informational message.
     * @param message - The message to log.
     */
    static info(message) {
        console.log(colors_1.default.blue(`[INFO] ${new Date().toISOString()} - ${message}`));
    }
    /**
     * Logs a success message.
     * @param message - The message to log.
     */
    static success(message) {
        console.log(colors_1.default.green(`[SUCCESS] ${new Date().toISOString()} - ${message}`));
    }
    /**
     * Logs a warning message.
     * @param message - The message to log.
     */
    static warning(message) {
        console.log(colors_1.default.yellow(`[WARNING] ${new Date().toISOString()} - ${message}`));
    }
    /**
     * Logs an error message.
     * @param message - The message to log.
     */
    static error(message) {
        console.log(colors_1.default.red(`[ERROR] ${new Date().toISOString()} - ${message}`));
    }
    /**
     * Logs a debug message.
     * @param message - The message to log.
     */
    static log(message) {
        console.log(colors_1.default.grey(`[LOG] ${new Date().toISOString()} - ${message}`));
    }
    /**
     * Dispatches logging based on the HTTP status code.
     * @param statusCode - The HTTP status code.
     * @param message - The message to log.
     * @returns {void}
     */
    static status(statusCode, message) {
        if (statusCode >= 200 && statusCode < 300) {
            this.success(message);
        }
        else if (statusCode >= 400 && statusCode < 500) {
            this.warning(message);
        }
        else if (statusCode >= 500) {
            this.error(message);
        }
        else {
            this.info(message);
        }
    }
}
exports.Debug = Debug;
exports.debug = Debug;
