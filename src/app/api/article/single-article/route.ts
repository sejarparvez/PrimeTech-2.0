import { Prisma } from '@/lib/prisma';
import { deleteImageFromCloudinary } from '@/utils/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    const id = queryParams.get('id');

    if (!id) {
      return new NextResponse('Missing field', { status: 400 });
    }

    // Fetch the design
    const design = await Prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },

        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!design) {
      return new NextResponse('Design not found', { status: 404 });
    }

    // Add like and comments count to the response object
    const enhancedResponse = {
      ...design,
      commentsCount: design.comments.length,
    };

    return new NextResponse(JSON.stringify(enhancedResponse), { status: 200 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    Prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    const id = queryParams.get('id');

    if (!id) {
      return new NextResponse('Missing article ID', { status: 400 });
    }

    // Check if the article exists
    const article = await Prisma.post.findUnique({
      where: { id },
    });

    if (!article) {
      return new NextResponse('Article not found', { status: 404 });
    }

    // Delete associated comments
    await Prisma.comment.deleteMany({
      where: { postId: id },
    });

    // Delete the image if it exists (Assuming imageId is present for external image deletion)
    if (article.imageId) {
      await deleteImageFromCloudinary(article.imageId);
    }

    // Delete the article
    await Prisma.post.delete({
      where: { id },
    });

    return new NextResponse(
      'Article and associated data deleted successfully',
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting article and associated data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    Prisma.$disconnect();
  }
}
