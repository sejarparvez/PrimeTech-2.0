"use client";

import { FetchRecentPost } from "@/components/fetch/post/FetchPost";
import { PostInterface } from "@/components/interface/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

      <div className="md:grid gap-6 md:grid-cols-4">
        {data.slice(0, 6).map((post: PostInterface, index: number) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg ${
              index === 2 || index === 3
                ? "col-span-2 row-span-2"
                : "row-span-3"
            } ${index === 3 ? "col-start-1 row-start-4" : ""}`}
          >
            <Image
              src={post.coverImage || "/default-image.jpg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4 text-white">
              <h3 className="mb-6 text-2xl font-bold">{post.title}</h3>
              {post.author && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={post.author.image} />
                      <AvatarFallback>
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
