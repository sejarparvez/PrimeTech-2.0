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

const secret = process.env.NEXTAUTH_SECRET;
const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.formData();

    const title = body.get("title");
    const content = body.get("content");
    const categories = body.get("category");
    const userId = body.get("userId");
    const id = body.get("id");
    const coverImageBlob = body.get("file") as File;

    if (!id) {
      return new NextResponse("Invalid post ID", { status: 400 });
    }

    const postId = id.toString();

    if (userId !== token.sub && token.status !== "Administrator") {
      return new NextResponse(
        "Unauthorized - You are not the author of this post",
        { status: 403 },
      );
    }

    let coverImageURL = null;
    if (coverImageBlob) {
      const buffer = Buffer.from(await coverImageBlob.arrayBuffer());
      const filename = Date.now() + coverImageBlob.name.replaceAll(" ", "_");

      const storageRef = ref(storage, "post/featured/" + filename);
      await uploadBytes(storageRef, buffer);

      coverImageURL = await getDownloadURL(storageRef);

      if (coverImageURL && postId) {
        const previousPost = await prisma.post.findUnique({
          where: { id: postId },
          select: { coverImage: true },
        });

        if (previousPost?.coverImage) {
          const previousImageRef = ref(storage, previousPost.coverImage);
          await deleteObject(previousImageRef);
        }
      }
    }

    const updatedPostData = {
      title: title as string,
      content: content as string,
      category: categories as string,
      ...(coverImageURL !== null && { coverImage: coverImageURL }),
    };

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updatedPostData,
    });

    return new NextResponse(JSON.stringify(updatedPost), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof Error) {
      return new NextResponse(`An error occurred: ${error.message}`, {
        status: 500,
      });
    }

    return new NextResponse("An error occurred", { status: 500 });
  }
}
