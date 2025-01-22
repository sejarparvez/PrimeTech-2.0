"use client";

import { useRecentPosts } from "@/app/services/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { articleInterFace } from "@/utils/interface";
import { createSlug } from "@/utils/slug";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Variant = "featured" | "horizontal";

const ProgrammingPost: FC = () => {
  const { data, isLoading, isError, refetch } = useRecentPosts();

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <SkeletonFeaturedPosts />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Failed to load posts. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </main>
    );
  }

  return (
    <section className="container pb-10 pt-10 md:pb-20 md:pt-16">
      <div className="mb-10 flex flex-col items-center gap-4 md:mb-16 md:flex-row md:gap-20">
        <h1 className="text-center text-3xl font-extrabold italic md:text-7xl">
          Programming Guide
        </h1>
        <Button
          variant="outline"
          className="flex w-full items-center justify-center space-x-4 px-8 py-4 md:w-auto md:space-x-10 md:px-20 md:py-6"
        >
          <p className="text-base md:text-lg">View All</p>
          <MoveUpRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
      {/* First Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
        <div className="grid grid-cols-1 gap-4 md:col-span-4 md:grid md:gap-4">
          {data[0] && <PostCard post={data[0]} variant="horizontal" />}
          {data[1] && <PostCard post={data[1]} variant="horizontal" />}
        </div>

        <div className="md:col-span-4">
          {data[2] && <PostCard post={data[2]} variant="featured" />}
        </div>

        <div className="grid grid-cols-1 gap-4 md:col-span-4 md:gap-4">
          {data[3] && <PostCard post={data[3]} variant="horizontal" />}
          {data[4] && <PostCard post={data[4]} variant="horizontal" />}
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          {data[5] && <PostCard post={data[5]} variant="featured" />}
        </div>

        <div className="grid grid-cols-1 gap-4 md:col-span-4 md:gap-4">
          {data[6] && <PostCard post={data[6]} variant="horizontal" />}
          {data[7] && <PostCard post={data[7]} variant="horizontal" />}
        </div>

        <div className="md:col-span-4">
          {data[8] && <PostCard post={data[8]} variant="featured" />}
        </div>
      </div>
    </section>
  );
};

interface PostCardProps {
  post: articleInterFace;
  variant: Variant;
}

const PostCard: FC<PostCardProps> = ({ post, variant }) => (
  <Link href={`${createSlug({ id: post.id, name: post.title })}`}>
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        variant === "horizontal" ? "flex h-64" : "h-64 md:h-[33rem]"
      }`}
    >
      <Image
        src={post.coverImage || "/default-image.jpg"}
        alt={`Cover image for ${post.title}`}
        width={variant === "horizontal" ? 300 : 800}
        height={variant === "horizontal" ? 256 : 528}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        priority={variant === "featured"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 text-white">
        <h3
          className={`mb-2 font-bold ${variant === "featured" ? "text-xl md:text-4xl" : "text-xl"}`}
        >
          {post.title}
        </h3>
        {variant === "featured" && post.author && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={post.author.image} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs text-gray-300">
                  {formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post._count.comments}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  </Link>
);

const SkeletonFeaturedPosts: FC = () => (
  <section className="container mx-auto px-4 py-16 md:py-24">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="md:col-span-8">
        <Card className="relative h-64 overflow-hidden md:h-[33rem]">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </Card>
      </div>
      <div className="space-y-4 md:col-span-4">
        {[0, 1].map((index) => (
          <Card
            key={index}
            className="relative flex h-48 overflow-hidden md:h-64"
          >
            <Skeleton className="absolute inset-0 h-full w-full" />
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default ProgrammingPost;
