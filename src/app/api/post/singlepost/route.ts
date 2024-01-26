import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function decodeFromUrl(encodedStr: string) {
  return decodeURIComponent(encodedStr.replace(/-/g, " "));
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    const encodedCategory = queryParams.get("category");
    const createdAt = queryParams.get("createdAt");
    const encodedTitle = queryParams.get("title");

    if (!encodedCategory || !encodedTitle || !createdAt) {
      return new NextResponse("Category, title, or createdAt not provided", {
        status: 400,
      });
    }

    const category = decodeFromUrl(encodedCategory);
    const title = decodeFromUrl(encodedTitle);

    const response = await prisma.post.findFirst({
      where: {
        category: {
          mode: "insensitive",
          equals: category,
        },
        title: {
          mode: "insensitive",
          equals: title,
        },
        createdAt: {
          gte: new Date(`${createdAt}T00:00:00.000Z`),
        },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!response) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);

    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
