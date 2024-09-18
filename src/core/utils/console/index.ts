import colors from 'colors';

export class Console {
  /**
   * Logs an informational message.
   * @param message - The message to log.
   */
  static info(message: string) {
    console.log(colors.blue(`[INFO] ${new Date().toISOString()} - ${message}`));
  }

  /**
   * Logs a success message.
   * @param message - The message to log.
   */
  static success(message: string) {
    console.log(colors.green(`[SUCCESS] ${new Date().toISOString()} - ${message}`));
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   */
  static warning(message: string) {
    console.log(colors.yellow(`[WARNING] ${new Date().toISOString()} - ${message}`));
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   */
  static error(message: string) {
    console.log(colors.red(`[ERROR] ${new Date().toISOString()} - ${message}`));
  }

  /**
   * Logs a debug message.
   * @param message - The message to log.
   */
  static debug(message: string) {
    console.log(colors.grey(`[DEBUG] ${new Date().toISOString()} - ${message}`));
  }

  /**
   * Dispatches logging based on the HTTP status code.
   * @param statusCode - The HTTP status code.
   * @param message - The message to log.
   * @returns {void}
   */
  static status(statusCode: number, message: string) {
    if (statusCode >= 200 && statusCode < 300) {
      this.success(message);
    } else if (statusCode >= 400 && statusCode < 500) {
      this.warning(message);
    } else if (statusCode >= 500) {
      this.error(message);
    } else {
      this.info(message);
    }
  }
}