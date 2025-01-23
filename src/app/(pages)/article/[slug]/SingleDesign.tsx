"use client";

import { useSinglePost } from "@/app/services/article";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import PostContent from "./PostContent";
import PostHeader from "./PostHeader";
import PostReadingProgress from "./PostReadingProgress";
import PostSharing from "./PostSharing";
import PostToc from "./PostToc";
import TiptapRenderer from "./TiptapRenderer";

export default function SingleDesign({ postlink }: { postlink: string }) {
  const [retryCount, setRetryCount] = useState(0);

  const id = postlink.split("_")[1];

  const { isLoading, data, isError, refetch } = useSinglePost({ id });

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
    <article className="flex flex-col items-center px-6 py-10">
      <PostReadingProgress />
      <PostHeader
        title={data.title}
        authorName={data.author.name}
        authorImage={data.author.image}
        createdAt={data.createdAt}
        category={data.category}
        cover={data.coverImage}
      />
      <div className="grid w-full grid-cols-1 gap-6 lg:w-auto lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] lg:gap-12">
        <PostSharing />
        <PostContent>
          <TiptapRenderer>{data.content}</TiptapRenderer>
        </PostContent>
        <PostToc />
      </div>
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
