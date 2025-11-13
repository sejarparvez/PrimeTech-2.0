'use client';

import { useSinglePost } from '@/app/services/article';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostReadingProgress from './PostReadingProgress';
import PostSharing from './PostSharing';
import PostToc from './PostToc';
import TiptapRenderer from './TiptapRenderer';

export default function SingleDesign({ postlink }: { postlink: string }) {
  const [retryCount, setRetryCount] = useState(0);

  const id = postlink.split('_')[1];

  const { isLoading, data, isError, refetch } = useSinglePost({ id });

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    refetch();
  };
  const postLink = `${process.env.NEXT_PUBLIC_SITE_URL}/article/${postlink}`;

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
              {retryCount >= 3 ? 'Too many attempts' : 'Retry'}
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
    <article className="container flex flex-col items-center py-6 md:py-10">
      <PostReadingProgress />
      <PostHeader
        title={data.title}
        authorName={data.author.name}
        updatedAt={data.updatedAt}
        cover={data.coverImage}
      />
      <div className="mx-auto mt-8 w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <PostSharing postlink={postLink} title={data.title} />

          <main className="order-2 lg:col-span-8">
            <PostContent>
              <TiptapRenderer>{data.content}</TiptapRenderer>
            </PostContent>
          </main>

          <aside className="order-1 lg:order-3 lg:col-span-3 lg:block">
            <PostToc />
          </aside>
        </div>
      </div>
    </article>
  );
}

function SinglePostSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-3/4 rounded-lg md:h-10" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-4 w-1/2 rounded-lg md:h-5" />
          <Skeleton className="h-6 w-24 rounded-lg md:h-7" />
        </div>

        <Skeleton className="aspect-video w-full rounded-xl" />

        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-4 w-full rounded-lg last:w-4/5"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
