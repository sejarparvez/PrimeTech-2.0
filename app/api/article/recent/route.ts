import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const category = searchParams.get('category');
    // New param: featured
    const featured = searchParams.get('featured') === 'true';

    const whereClause = {
      status: 'PUBLISHED' as const,
      ...(category && { category: { slug: category.toLowerCase() } }),
      ...(featured && { isFeatured: true }), // Only filter if featured=true is passed
    };

    const [totalArticles, articles] = await Promise.all([
      prisma.article.count({ where: whereClause }),
      prisma.article.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          isFeatured: true,
          updatedAt: true,
          author: { select: { name: true, image: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: skip,
      }),
    ]);

    return NextResponse.json({
      data: articles,
      meta: {
        total: totalArticles,
        page,
        limit,
        totalPages: Math.ceil(totalArticles / limit),
        hasMore: page < Math.ceil(totalArticles / limit),
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
