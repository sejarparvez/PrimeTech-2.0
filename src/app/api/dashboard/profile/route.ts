import { Prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const skip = parseInt(req.nextUrl.searchParams.get('skip') || '0', 10); // Get the skip parameter

    if (!id) {
      return new NextResponse('ID parameter is required', { status: 400 });
    }

    // Fetch user data along with total design count
    const response = await Prisma.user.findUnique({
      where: { id },

      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        image: true,
        bio: true,
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 12,
          skip: skip, // Use skip to prevent duplication
        },
        _count: {
          select: {
            posts: true, // Fetch the total count of designs
          },
        },
      },
    });

    if (!response) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
