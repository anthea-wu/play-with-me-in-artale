import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { UpdateGroupSchema } from '@/lib/validations';
import { 
  createSuccessResponse, 
  handleApiError,
  validateRequestBody 
} from '@/lib/api-helpers';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Validate request body
    const validatedData = await validateRequestBody(request, UpdateGroupSchema);
    
    // Extract private key from validated data
    const { privateKey, ...updateData } = validatedData;
    
    // Find the group by ID and private key
    const existingGroup = await prisma.group.findFirst({
      where: {
        id,
        privateKey,
      },
    });
    
    if (!existingGroup) {
      return Response.json(
        { error: 'Group not found or invalid private key' },
        { status: 404 }
      );
    }
    
    // Update the group
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: updateData,
    });
    
    return createSuccessResponse(updatedGroup, 'Group updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get private key from request body
    const body = await request.json();
    const { privateKey } = body;
    
    if (!privateKey) {
      return Response.json(
        { error: 'Private key is required' },
        { status: 400 }
      );
    }
    
    // Find the group by ID and private key
    const existingGroup = await prisma.group.findFirst({
      where: {
        id,
        privateKey,
      },
    });
    
    if (!existingGroup) {
      return Response.json(
        { error: 'Group not found or invalid private key' },
        { status: 404 }
      );
    }
    
    // Delete the group
    await prisma.group.delete({
      where: { id },
    });
    
    return createSuccessResponse(null, 'Group deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}