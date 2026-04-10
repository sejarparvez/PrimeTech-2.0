import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  cloudinaryUploadImage,
  deleteImageFromCloudinary,
} from '@/utils/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.formData();

    // 1. Extract and Parse Data
    const title = data.get('title') as string;
    const slug = data.get('slug') as string;
    const content = data.get('content') as string;
    const categoryId = data.get('category') as string; // This is the ID from the frontend select
    const isFeatured = data.get('isFeatured') === 'true';

    // Parse tags (they were sent as JSON.stringify in the frontend)
    const rawTags = data.get('tags') as string;
    const tags = rawTags ? JSON.parse(rawTags) : [];

    const imageFile = data.get('image') as File;

    // 2. Validation
    if (!title || !slug || !categoryId || !content || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields or image' },
        { status: 400 },
      );
    }

    // 3. Upload to Cloudinary
    let imageUrl = { secure_url: '', public_id: '' };
    imageUrl = await cloudinaryUploadImage(imageFile, 'Article/');

    // 4. Create in Prisma
    const newPost = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        isFeatured,
        tags,
        coverImage: imageUrl.secure_url,
        imageId: imageUrl.public_id,
        // Connect the relations correctly
        author: { connect: { id: session.user.id } },
        category: { connect: { id: categoryId } },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('category') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const oldImageId = formData.get('deletedImage') as string;
    const imageFile = formData.get('image') as File | null;

    const rawTags = formData.get('tags') as string;
    const tags = rawTags ? JSON.parse(rawTags) : [];

    if (!id)
      return NextResponse.json(
        { error: 'Article ID required' },
        { status: 400 },
      );

    // biome-ignore lint/suspicious/noExplicitAny: prisma update type
    const updateData: any = {
      title,
      slug,
      content,
      isFeatured,
      tags,
      category: { connect: { id: categoryId } },
    };

    // Handle Image Update
    if (imageFile && imageFile.size > 0) {
      const imageUrl = await cloudinaryUploadImage(imageFile, 'Article/');
      updateData.coverImage = imageUrl.secure_url;
      updateData.imageId = imageUrl.public_id;

      // Cleanup old image from Cloudinary
      if (oldImageId) {
        await deleteImageFromCloudinary(oldImageId);
      }
    }

    const updatedPost = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
