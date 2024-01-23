import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);

    const page = queryParams.get("page")
      ? parseInt(queryParams.get("page")!, 10)
      : 1;
    const pageSize = queryParams.get("pageSize")
      ? parseInt(queryParams.get("pageSize")!, 10)
      : 10;

    const skipCount = (page - 1) * pageSize;

    const totalPostsCount = await prisma.post.count();

    const allPosts = await prisma.post.findMany({
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
      skip: skipCount,
      take: pageSize,
    });

    if (allPosts.length > 0) {
      // Include the total count along with the paginated posts in the response
      return new NextResponse(
        JSON.stringify({ posts: allPosts, totalPostsCount }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } else {
      return new NextResponse("No posts found.", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
