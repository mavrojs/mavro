import { Request, Response, Middleware } from "../types";
import * as fs from "fs";
import * as path from "path";

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
export const logger: Middleware = (req: Request, res: Response, next: () => void) => {
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
