"use client";

import { FetchSinglePost } from "@/components/fetch/get/singlepost/FetchSinglePost";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import Header from "./Header";
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
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
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

  return (
    <div className="container max-w-4xl mx-auto my-8 px-2 lg:px-6">
      <div>
        {isLoading ? (
          <Skeleton className="h-[30rem] w-full rounded-xl md:h-[40rem] lg:h-[50rem]" />
        ) : (
          <>
            <Header
              title={data.title}
              image={data.coverImage}
              name={data.author.name}
              updatedAt={data.updatedAt}
              category={data.category}
              createdAt={data.createdAt}
              authorId={data.authorId}
            />
            <BlogPostContent content={data.content} />
          </>
        )}
      </div>
    </div>
  );
}
