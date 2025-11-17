import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const generation = await prisma.generation.findUnique({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user owns this generation
      },
      select: {
        id: true,
        type: true,
        status: true,
        resultUrl: true,
        error: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(generation);
  } catch (error) {
    console.error('Failed to fetch generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
