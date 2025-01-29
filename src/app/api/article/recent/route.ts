import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const response = await prisma.post.findMany({
      take: 9,
      select: {
        id: true,
        title: true,
        category: true,
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
    });

    if (response.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No posts found' }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
