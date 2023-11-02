import checkIfImageExists from "@/components/helper/ImageCheck";
import storage from "@/utils/firebaseConfig";
import { PrismaClient } from "@prisma/client";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return new NextResponse("Token not found");
    }

    const id = token.sub;

    const userInfo = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        image: true,
        facebook: true,
        linkedin: true,
        twitter: true,
        github: true,
        instagram: true,
        bio: true,
      },
    });
    if (!userInfo) {
      return new NextResponse("User not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(userInfo), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error fetching user", { status: 409 });
  } finally {
    prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.formData();

    const email = body.get("email");
    const name = body.get("name");
    const coverImageBlob = body.get("image") as File | null;
    const token = await getToken({ req, secret });
    const id = token?.sub;

    if (!token) {
      return new NextResponse("You are not logged in", { status: 401 });
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }
    // Check if the user has an image in Firebase Storage
    if (existingUser.image) {
      const imageExists = await checkIfImageExists(existingUser.image);
      if (imageExists) {
        // Delete the previous cover image
        const storageRefToDelete = ref(storage, existingUser.image);
        await deleteObject(storageRefToDelete);
      }
    }

    // Upload the new cover image
    let image = null;

    if (coverImageBlob) {
      const buffer = Buffer.from(await coverImageBlob.arrayBuffer());
      const filename = Date.now() + coverImageBlob.name.replaceAll(" ", "_");

      // Upload file to Firebase storage
      const storageRef = ref(storage, "profile/" + filename);
      await uploadBytes(storageRef, buffer);

      // Get download URL from Firebase storage
      image = await getDownloadURL(storageRef);
    }
    // Update the user's data using Prisma
    const updatedProfileData: {
      name: string;
      image?: string;
    } = {
      name: name as string,
    };

    if (image !== null) {
      updatedProfileData.image = image;
    }

    // Update user information
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedProfileData,
    });

    return new NextResponse(JSON.stringify(updatedUser), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    return new NextResponse("Error updating user information", {
      status: 500,
    });
  }
}
