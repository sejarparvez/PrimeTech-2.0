import { Prisma } from '@/lib/prisma';
import cloudinary, { cloudinaryUploadImage } from '@/utils/cloudinary';
import bcrypt from 'bcrypt';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token)
    return NextResponse.json({ message: 'Token not found' }, { status: 401 });

  const id = token.sub;

  try {
    const user = await Prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        image: true,
        bio: true,
        password: true,
      },
    });

    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const userInfo = {
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      password: user.password !== null,
    };

    return NextResponse.json(userInfo);
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name')?.toString();
    const bio = formData.get('bio')?.toString();
    const coverImageBlob = formData.get('avatar');

    if (!name) {
      return NextResponse.json({ message: 'Missing name' }, { status: 400 });
    }

    const token = await getToken({ req, secret });
    if (!token)
      return NextResponse.json(
        { message: 'You are not logged in' },
        { status: 401 }
      );

    const existingUser = await Prisma.user.findUnique({
      where: { id: token.sub },
    });
    if (!existingUser)
      return NextResponse.json({ message: 'User not found' }, { status: 404 });

    let imageUrl = { secure_url: '', public_id: '' };

    // Only check for image existence and deletion if a new image is provided
    if (coverImageBlob instanceof File) {
      // If there's a new image, check if there's an existing one to delete
      if (existingUser.imageId) {
        const result = await cloudinary.uploader.destroy(existingUser.imageId);
        if (result.result !== 'ok') {
          return new NextResponse('error', { status: 400 });
        }
      }

      // Upload the image to Cloudinary and get the URL
      imageUrl = await cloudinaryUploadImage(coverImageBlob, 'profile/');
    }

    // Update user info with new image URL if provided
    const updatedUser = await Prisma.user.update({
      where: { id: token.sub },
      data: {
        name,
        bio,
        image: imageUrl.secure_url || existingUser.image, // Use the new image if uploaded, otherwise keep existing
        imageId: imageUrl.public_id || existingUser.imageId, // Update imageId if a new image is uploaded
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { currentPassword, newPassword } = data;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }

    const token = await getToken({ req, secret });
    if (!token)
      return NextResponse.json(
        { message: 'You are not logged in' },
        { status: 401 }
      );

    const existingUser = await Prisma.user.findUnique({
      where: { id: token.sub },
    });
    if (!existingUser)
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    // Check if the password is not null before comparing
    if (existingUser.password === null) {
      return new NextResponse('User password is null', { status: 500 });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );

    if (!isPasswordValid) {
      return new NextResponse('Current password is incorrect', { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await Prisma.user.update({
      where: { id: token.sub },
      data: {
        password: hashedNewPassword,
      },
    });

    return new NextResponse('Password updated successfully');
  } catch (error) {
    return new NextResponse('Error updating password', { status: 500 });
  } finally {
    Prisma.$disconnect();
  }
}
