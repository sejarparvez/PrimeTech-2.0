'use client';

import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, MessageCircle, MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles } from '@/services/article';
import type { ArticleListType } from '@/types/article';

const LIMIT = 6;

export default function RecentPostsList() {
  const [page, setPage] = useState(1);

  // Use our new paginated hook
  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isPlaceholderData,
  } = useArticles({
    limit: LIMIT,
    page: page,
  });

  const handleRetry = () => refetch();

  if (isError) {
    return (
      <section className='container px-4 md:px-0 mx-auto mt-10 md:mt-16'>
        <div className='flex min-h-[40vh] flex-col items-center justify-center p-6 text-center'>
          <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
            <AlertCircle className='text-destructive h-10 w-10' />
          </div>
          <h2 className='mb-2 text-2xl font-bold tracking-tight'>
            Couldn't load articles
          </h2>
          <Button onClick={handleRetry} variant='outline' className='mt-4'>
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  // Extract articles from the paginated response
  const articles = response?.data ?? [];
  const meta = response?.meta;

  return (
    <section className='container px-4 mx-auto mt-10 md:mt-16'>
      <div className='mb-10 flex flex-col items-center justify-between gap-4 md:mb-16 md:flex-row'>
        <div className='space-y-1 text-center md:text-left'>
          <h2 className='text-3xl font-extrabold italic md:text-6xl tracking-tight'>
            Latest Articles
          </h2>
          <p className='text-muted-foreground'>
            Discover our most recent stories and guides.
          </p>
        </div>

        <Link href='/articles'>
          <Button variant='outline' size='lg' className='group'>
            View All
            <MoveUpRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {isLoading ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
          Array.from({ length: LIMIT }).map((_, i) => <PostSkeleton key={i} />)
        ) : articles.length > 0 ? (
          articles.map((post) => <PostCard key={post.id} data={post} />)
        ) : (
          <div className='col-span-full py-20 text-center border-2 border-dashed rounded-2xl'>
            <p className='text-muted-foreground'>No articles available yet.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className='mt-12 flex items-center justify-center gap-4'>
          <Button
            variant='ghost'
            disabled={page === 1 || isPlaceholderData}
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
          >
            Previous
          </Button>
          <span className='text-sm font-medium'>
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant='ghost'
            disabled={!meta.hasMore || isPlaceholderData}
            onClick={() => setPage((old) => old + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// PostCard (Updated for new Schema)
// ---------------------------------------------------------------------------

export function PostCard({ data }: { data: ArticleListType }) {
  // Use the slug directly from the database
  const href = `/article/${data.slug}`;

  return (
    <Link href={href} className='group block h-full'>
      <Card className='h-full overflow-hidden p-0 border-none bg-background shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
        <div className='relative h-52 sm:h-64'>
          <Image
            src={data.coverImage || '/placeholder.jpg'}
            alt={data.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
          {data.category && (
            <Badge className='absolute left-4 top-4 z-10 bg-white/90 text-black backdrop-blur-md hover:bg-white'>
              {data.category.name}
            </Badge>
          )}
        </div>

        <div className='flex flex-col justify-between p-5 sm:p-6'>
          <div>
            <h3 className='mb-3 line-clamp-2 text-xl font-bold leading-tight transition-colors group-hover:text-primary sm:text-2xl'>
              {data.title}
            </h3>
          </div>

          <div className='mt-4 flex items-center justify-between border-t pt-4'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={data.author?.image} />
                <AvatarFallback>{data.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-xs font-bold'>{data.author?.name}</p>
                <time className='text-[10px] text-muted-foreground uppercase tracking-widest'>
                  {formatDistanceToNow(new Date(data.updatedAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>

            <div className='flex items-center text-muted-foreground'>
              <MessageCircle className='mr-1.5 h-4 w-4' />
              <span className='text-xs font-medium'>
                {data._count?.comments ?? 0}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ... Keep PostSkeleton as is

// ---------------------------------------------------------------------------
// PostSkeleton
// ---------------------------------------------------------------------------

export function PostSkeleton() {
  return (
    <div className='overflow-hidden rounded-lg bg-card shadow-md'>
      <Skeleton className='h-48 w-full sm:h-64' />
      <div className='p-4 sm:p-6'>
        <Skeleton className='mb-2 h-6 w-3/4' />
        <Skeleton className='mb-4 h-4 w-full' />
        <Skeleton className='mb-4 h-4 w-2/3' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 sm:space-x-4'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <div>
              <Skeleton className='mb-1 h-4 w-16' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
          <Skeleton className='h-4 w-8' />
        </div>
      </div>
    </div>
  );
}
