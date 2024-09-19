import { Response } from "../types";
import { statusCodes } from "../utils";

/**
 * A base controller class providing static methods for common response operations.
 * 
 * This class contains static methods that can be used to send JSON responses and handle errors.
 * It is intended to be extended by other controllers that require these functionalities.
 */
export class Controller {
  
  /**
   * Sends a JSON response with the given data and status code.
   * 
   * @param res - The response object used to send the response.
   * @param data - The data to be sent in the JSON response.
   * @param statusCode - The HTTP status code to be sent (default is 200).
   * 
   * This method sets the content type to application/json and sends the provided data as the response body.
   */
  static json(res: Response, data: any, statusCode: number = 200): void {
    res.json({
      ...statusCodes[statusCode],
      data
    });
  }

  /**
   * Sends an error response with a 500 status code and an error message.
   * 
   * @param res - The response object used to send the response.
   * @param message - The error message to be sent in the response body.
   * 
   * This method sets the status code to 500 (Internal Server Error) and sends a JSON object containing
   * the error message. This is used to indicate that an unexpected error occurred on the server.
   */
  static error(res: Response, message: string): void {
    res.json({
      ...statusCodes[500],
      error: message
    });
  }
}