import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const authors = await prisma.user.findMany({
      where: {
        Articles: { some: { status: 'PUBLISHED' } },
      },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        _count: {
          select: {
            Articles: { where: { status: 'PUBLISHED' } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ data: authors }, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 },
    );
  }
}
