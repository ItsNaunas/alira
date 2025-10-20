/**
 * Centralized Error Handling System
 * 
 * This module provides:
 * - Standardized error creation with status codes
 * - Safe error responses that never leak sensitive data
 * - Production-safe error logging
 * - Type-safe error handling
 */

import 'server-only'
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Custom Application Error with status code
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Create a standardized error
 */
export function createError(
  message: string,
  statusCode: number = 500,
  code?: string
): AppError {
  return new AppError(message, statusCode, code);
}

/**
 * Format Zod validation errors into user-friendly messages
 */
function formatZodError(error: ZodError): string {
  const errors = error.errors.map((err) => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
  return `Validation failed: ${errors.join(', ')}`;
}

/**
 * Handle API errors safely
 * 
 * This function:
 * - Logs errors server-side for debugging
 * - Never exposes stack traces or sensitive data to clients
 * - Returns appropriate HTTP status codes
 * - Formats Zod validation errors nicely
 */
export function handleApiError(error: unknown): NextResponse {
  // Log the full error server-side for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: formatZodError(error),
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  // Handle our custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle generic errors
  // IMPORTANT: Never expose error details in production
  const isDev = process.env.NODE_ENV === 'development';
  const message = error instanceof Error && isDev
    ? error.message
    : 'An unexpected error occurred';

  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Common error factory functions
 */
export const errors = {
  unauthorized: (message = 'Authentication required') =>
    createError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message = 'You do not have permission to access this resource') =>
    createError(message, 403, 'FORBIDDEN'),
  
  notFound: (resource = 'Resource') =>
    createError(`${resource} not found`, 404, 'NOT_FOUND'),
  
  badRequest: (message = 'Invalid request') =>
    createError(message, 400, 'BAD_REQUEST'),
  
  paymentRequired: (message = 'Payment required to access this resource') =>
    createError(message, 402, 'PAYMENT_REQUIRED'),
  
  conflict: (message = 'Resource conflict') =>
    createError(message, 409, 'CONFLICT'),
  
  tooManyRequests: (message = 'Too many requests') =>
    createError(message, 429, 'RATE_LIMITED'),
  
  internal: (message = 'Internal server error') =>
    createError(message, 500, 'INTERNAL_ERROR'),
};

