"use client";

import { FetchFeaturedPosts } from "@/components/fetch/get/featured/FetchFeaturedPost";
import { createSlug } from "@/components/helper/Slug";
import { PostInterface } from "@/components/interface/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export default function Featured() {
  const { data, isLoading, isError } = FetchFeaturedPosts();

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
        <p>Failed to load posts. Please try again.</p>
      </main>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <PostCard post={data[0]} variant="featured" />
        </div>
        <div className="space-y-4 md:col-span-4">
          <PostCard post={data[1]} variant="horizontal" />
          <PostCard post={data[2]} variant="horizontal" />
        </div>
      </div>
    </section>
  );
}

interface FeaturedPostsHeroProps {
  posts: PostInterface[];
}

const FeaturedPostsHero: FC<FeaturedPostsHeroProps> = ({ posts }) => (
  <section className="container mx-auto px-4 py-16 md:py-24">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="md:col-span-8">
        <PostCard post={posts[0]} variant="featured" />
      </div>
      <div className="space-y-4 md:col-span-4">
        <PostCard post={posts[1]} variant="horizontal" />
        <PostCard post={posts[2]} variant="horizontal" />
      </div>
    </div>
  </section>
);

interface PostCardProps {
  post: PostInterface;
  variant: "featured" | "horizontal";
}

const PostCard: FC<PostCardProps> = ({ post, variant }) => (
  <Link href={`/article/${createSlug({ id: post.id, name: post.title })}`}>
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        variant === "horizontal" ? "flex h-48 md:h-64" : "h-64 md:h-[33rem]"
      }`}
    >
      <Image
        src={post.coverImage}
        alt={`Cover image for ${post.title}`}
        width={variant === "horizontal" ? 300 : 800}
        height={variant === "horizontal" ? 256 : 528}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 text-white">
        <Badge variant="secondary" className="mb-2 w-fit">
          {post.category}
        </Badge>
        <h3
          className={`mb-2 font-bold ${
            variant === "featured" ? "text-2xl md:text-5xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>
        {variant === "featured" && (
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
              <span className="text-xs">{post.commentCount}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  </Link>
);

const SkeletonFeaturedPosts = () => (
  <section className="container mx-auto px-4 py-16 md:py-24">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="md:col-span-8">
        <Card className="relative h-64 overflow-hidden md:h-[33rem]">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </Card>
      </div>
      <div className="space-y-4 md:col-span-4">
        <Card className="relative flex h-48 overflow-hidden md:h-64">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </Card>
        <Card className="relative flex h-48 overflow-hidden md:h-64">
          <Skeleton className="absolute inset-0 h-full w-full" />
        </Card>
      </div>
    </div>
  </section>
);
