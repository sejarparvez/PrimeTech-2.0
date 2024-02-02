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

    const category = queryParams.get("category");

    if (!category) {
      return new NextResponse("No category specified", { status: 404 });
    }

    const skipCount = (page - 1) * pageSize;

    const totalPostsCount = await prisma.post.count({
      where: { category: category },
    });

    const allPosts = await prisma.post.findMany({
      where: {
        category: category,
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        category: true,
        updatedAt: true,
        createdAt: true,
        content: true,
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

    // Remove HTML tags from content
    const sanitizedPosts = allPosts.map((post) => {
      return {
        ...post,
        content: post.content.replace(/<[^>]*>/g, ""), // Remove HTML tags
      };
    });

    // Truncate content to 200 characters
    const truncatedPosts = sanitizedPosts.map((post) => {
      return {
        ...post,
        content: post.content.slice(0, 180),
      };
    });

    if (truncatedPosts.length > 0) {
      return new NextResponse(
        JSON.stringify({ posts: truncatedPosts, totalPostsCount }),
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
