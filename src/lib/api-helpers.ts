import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError, ApiResponse } from './types';

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  }, { status });
}

export function createErrorResponse(
  error: string,
  details?: unknown,
  status: number = 400
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return createErrorResponse(
      'Validation failed',
      error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      400
    );
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message, null, 500);
  }

  return createErrorResponse('Internal server error', null, 500);
}

export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await request.json();
  return schema.parse(body);
}