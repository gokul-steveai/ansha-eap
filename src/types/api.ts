import { ERROR_CODES, ErrorCode } from "./errorCodes";

/**
 * Standard API response wrapper with better error handling
 */
export type ApiResponse<T = any> = 
  | SuccessResponse<T>
  | ErrorResponse;

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
  code?: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  code: ErrorCode;
  details?: Record<string, any>;
  timestamp: string;
};

/**
 * Helper function to create success response
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = "Success"
): SuccessResponse<T> => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

/**
 * Helper function to create error response
 */
export const createErrorResponse = (
  message: string,
  code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
  details?: Record<string, any>
): ErrorResponse => ({
  success: false,
  message,
  code,
  details,
  timestamp: new Date().toISOString(),
});
