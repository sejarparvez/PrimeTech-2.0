import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const url = new URL(req.url);
    // const queryParams = new URLSearchParams(url.search);
    // const searchName = queryParams.get("search") || "";
    const lastUpdatedPost = await prisma.post.findMany({
      where: {
        category: "Featured",
      },

      select: {
        id: true,
        title: true,
        coverImage: true,
        category: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 3,
    });

    if (lastUpdatedPost) {
      // Return the last updated post with author's name
      return new NextResponse(JSON.stringify(lastUpdatedPost), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // No post found in the "featured" category
      return new NextResponse("No featured posts found.", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching last updated post:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
