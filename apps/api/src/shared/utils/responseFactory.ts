import { Response } from "express";

export class ApiResponseFactory {
  /**
   * Factory method: Generates a standardized API Success response.
   */
  public static success<T = unknown>(res: Response, message: string, data: T | null = null, code: number = 200) {
    return res.status(code).json({
      status: "success",
      message,
      data,
    });
  }

  /**
   * Factory method: Generates a standardized API Error response.
   */
  public static error<T = unknown>(res: Response, message: string, code: number = 500, details: T | null = null) {
    return res.status(code).json({
      status: "error",
      message,
      details,
    });
  }
}
