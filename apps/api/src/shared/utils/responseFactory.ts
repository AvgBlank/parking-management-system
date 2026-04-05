import { Response } from "express";

export class ApiResponseFactory {
  /**
   * Factory method: Generates a standardized API Success response.
   */
  public static success(res: Response, message: string, data: any = null, code: number = 200) {
    return res.status(code).json({
      status: "success",
      message,
      data,
    });
  }

  /**
   * Factory method: Generates a standardized API Error response.
   */
  public static error(res: Response, message: string, code: number = 500, details: any = null) {
    return res.status(code).json({
      status: "error",
      message,
      details,
    });
  }
}
