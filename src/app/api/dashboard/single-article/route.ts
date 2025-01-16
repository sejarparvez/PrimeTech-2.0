import { UploadImage } from "@/helper/UploadImage";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return new NextResponse("User not logged in", { status: 401 });
    }

    const data = await req.formData();

    const title = data.get("title") as string;
    const cover = data.get("image") as File;
    const categories = data.get("category") as string;
    const content = data.get("content") as string;

    if (!title || !cover || !categories || !content) {
      return new NextResponse("Missing title, file, categories, or content", {
        status: 400,
      });
    }

    // Handle image file if present
    const imageFile = data.get("image") as Blob;
    let imageUrl = { secure_url: "", public_id: "" };

    if (imageFile) {
      // Upload the image to Cloudinary and get the URL
      imageUrl = await UploadImage(imageFile, "Article/");
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        coverImage: imageUrl.secure_url,
        imageId: imageUrl.public_id,
        category: categories,
        content,
        author: { connect: { id: token.sub } },
      },
    });

    return new NextResponse(JSON.stringify(newPost), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
