import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
      // Consistency: Sort alphabetically
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}
