"use client";

import { FetchSinglePost } from "@/components/fetch/get/singlepost/FetchSinglePost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BlogPostContent from "./MainContent";

export default function SingleDesign({ postlink }: { postlink: string }) {
  const [retryCount, setRetryCount] = useState(0);

  const id = postlink.split("_")[1];

  const { isLoading, data, isError, refetch } = FetchSinglePost({ id });

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    refetch();
  };

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Error Loading Design</h2>
            <p className="text-center text-muted-foreground">
              We couldn&apos;t load the design. Please try again.
            </p>
            <Button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className="w-full"
            >
              {retryCount >= 3 ? "Too many attempts" : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <SinglePostSkeleton />;
  }

  return (
    <article className="container mx-auto my-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="mb-4 text-2xl font-extrabold text-primary sm:text-4xl lg:text-4xl">
          {data.title}
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>This article was last updated by</span>

              <Link
                href={`/users/${data.author.id}`}
                className="flex items-center gap-1 font-medium text-foreground hover:underline"
              >
                <User className="h-4 w-4 text-primary" />
                {data.author.name}
              </Link>

              <span>on</span>

              <time
                dateTime={data.updatedAt}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(data.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <Badge className="w-fit md:hidden">{data.category}</Badge>
            </div>
          </div>
          <Badge className="hidden w-fit md:block">{data.category}</Badge>
        </div>
      </header>

      <figure className="mb-8 overflow-hidden rounded-lg">
        <Image
          src={data.coverImage}
          alt={data.title}
          className="h-auto w-full object-cover transition-transform duration-300"
          width={900}
          height={500}
          priority
        />
      </figure>

      <BlogPostContent content={data.content} />
    </article>
  );
}

function SinglePostSkeleton() {
  return (
    <div className="container mx-auto my-8 max-w-4xl px-4">
      <Skeleton className="mb-4 h-8 w-3/4" />
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
