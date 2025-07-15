import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { CreateGroupSchema } from '@/lib/validations';
import { 
  createSuccessResponse, 
  handleApiError,
  validateRequestBody 
} from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validatedData = await validateRequestBody(request, CreateGroupSchema);
    
    // Create group in database
    const group = await prisma.group.create({
      data: validatedData,
    });
    
    return createSuccessResponse(group, 'Group created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    // Get all groups, ordered by creation date (newest first)
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return createSuccessResponse(groups, 'Groups retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}