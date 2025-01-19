"use client";

import { FetchRecentPost } from "@/components/fetch/post/FetchPost";
import { createSlug } from "@/components/helper/Slug";
import { PostInterface } from "@/components/interface/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export default function ComputingPost() {
  const { isLoading, data, isError } = FetchRecentPost();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Failed to load posts.</p>;

  return (
    <div className="container">
      <div className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-20">
        <h1 className="text-center text-4xl font-extrabold italic md:text-7xl">
          Laptops & Computers
        </h1>
        <Button
          variant="outline"
          className="flex w-full items-center justify-center space-x-4 px-8 py-4 md:w-auto md:space-x-10 md:px-20 md:py-6"
        >
          <p className="text-base md:text-lg">View All</p>
          <MoveUpRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-5">
        <div className="md:col-span-2 md:row-span-2">
          <PostCard post={data[0]} variant="featured" />
        </div>
        <div className="md:row-span-3">
          <PostCard post={data[1]} variant="horizontal" />
        </div>
        <div className="md:row-span-3">
          <PostCard post={data[2]} variant="horizontal" />
        </div>
        <div className="md:row-span-3">
          <PostCard post={data[3]} variant="horizontal" />
        </div>
        <div className="md:row-span-3">
          <PostCard post={data[4]} variant="horizontal" />
        </div>
        <div className="md:col-span-2 md:row-span-2">
          <PostCard post={data[5]} variant="featured" />
        </div>
      </div>
    </div>
  );
}

interface PostCardProps {
  post: PostInterface;
  variant: "featured" | "horizontal";
}

const PostCard: FC<PostCardProps> = ({ post, variant }) => (
  <Link href={`${createSlug({ id: post.id, name: post.title })}`}>
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        variant === "horizontal" ? "flex h-72 md:h-full" : "h-72"
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
          className={`mb-2 font-bold ${variant === "featured" ? "text-xl md:text-2xl" : "text-xl"}`}
        >
          {post.title}
        </h3>
        {variant === "horizontal" && post.author && (
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
