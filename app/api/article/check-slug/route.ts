import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const whereClause: { slug: string; id?: { not: string } } = {
      slug,
    };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existingArticle = await prisma.article.findFirst({
      where: whereClause,
      select: { id: true, title: true },
    });

    return NextResponse.json({
      available: !existingArticle,
      existingArticle: existingArticle || null,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to check slug' },
      { status: 500 },
    );
  }
}
