import { Prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const lastUpdatedPost = await Prisma.post.findMany({
      where: {
        category: 'Featured',
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 3,
    });

    if (lastUpdatedPost.length > 0) {
      return new NextResponse(JSON.stringify(lastUpdatedPost), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new NextResponse('No featured posts found.', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'PrismaClientKnownRequestError'
    ) {
      return new NextResponse('Duplicate entry error.', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    console.error('Error fetching last updated post:', error);

    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  } finally {
    await Prisma.$disconnect();
  }
}
