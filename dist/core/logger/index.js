"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Define the directory and file path for logs
const logDirectory = path.join(process.cwd(), 'logs');
const logFilePath = path.join(logDirectory, "app.log");
/**
 * Logger middleware that writes request and response details to a log file.
 * Creates the log file and directory if they don't exist.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The function to pass control to the next middleware.
 */
const logger = (req, res, next) => {
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    const timestamp = new Date().toISOString();
    const startTime = Date.now();
    const { method, url } = req;
    logStream.write(`[${timestamp}] [Request]: ${method} ${url}\n`);
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        logStream.write(`[${timestamp}] [Response]: ${res.statusCode} - ${duration}ms\n\n`);
        logStream.end();
    });
    next();
};
exports.logger = logger;
