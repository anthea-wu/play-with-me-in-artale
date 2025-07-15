import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection by fetching all groups
    const groups = await prisma.group.findMany();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: groups,
      count: groups.length,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}