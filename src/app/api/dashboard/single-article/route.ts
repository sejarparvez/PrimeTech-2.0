import { Prisma } from '@/lib/prisma';
import {
  cloudinaryUploadImage,
  deleteImageFromCloudinary,
} from '@/utils/cloudinary';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

// Helper function to extract string value from formData
function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return new NextResponse('User not logged in', { status: 401 });
    }

    const data = await req.formData();

    const title = data.get('title') as string;
    const cover = data.get('image') as File;
    const categories = data.get('category') as string;
    const content = data.get('content') as string;
    const tags =
      data
        .get('tags')
        ?.toString()
        .split(',')
        .map((tag) => tag.trim()) || [];

    if (!title || !cover || !categories || !content) {
      return new NextResponse('Missing title, file, categories, or content', {
        status: 400,
      });
    }

    // Handle image file if present
    const imageFile = data.get('image') as Blob;
    let imageUrl = { secure_url: '', public_id: '' };

    if (imageFile) {
      // Upload the image to Cloudinary and get the URL
      imageUrl = await cloudinaryUploadImage(imageFile, 'Article/');
    }

    const newPost = await Prisma.post.create({
      data: {
        title,
        coverImage: imageUrl.secure_url,
        imageId: imageUrl.public_id,
        category: categories,
        content,
        tags,
        author: { connect: { id: token.sub } },
      },
    });

    return new NextResponse(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('An error occurred', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return new NextResponse('User not logged in', { status: 401 });
    }

    const formData = await req.formData();

    const id = getStringValue(formData, 'id');
    const title = getStringValue(formData, 'title');
    const content = getStringValue(formData, 'content');
    const category = getStringValue(formData, 'category');
    const imageId = getStringValue(formData, 'deletedImage');
    const image = formData.get('image') as Blob;
    const tags = getStringValue(formData, 'tags')
      .split(',')
      .map((tag) => tag.trim());

    let imageUrl = { secure_url: '', public_id: '' };
    if (image) {
      // Upload the image to Cloudinary
      imageUrl = await cloudinaryUploadImage(image, 'Article/');

      // Delete the old image if needed
      if (imageId) {
        await deleteImageFromCloudinary(imageId);
      }
    }

    // Update the post in the database
    const updatedPost = await Prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        category,
        tags,
        ...(image && {
          coverImage: imageUrl.secure_url,
          imageId: imageUrl.public_id,
        }),
      },
    });

    return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal server error', { status: 500 });
  } finally {
    await Prisma.$disconnect();
  }
}
