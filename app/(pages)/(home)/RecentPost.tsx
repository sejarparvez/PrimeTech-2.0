'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentPosts } from '@/services/article';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  MessageCircle,
  MoveUpRight,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { articleInterFace } from '../../../utils/interface';
import { createSlug } from '../../../utils/slug';

const SKELETON_COUNT = 6;

export default function RecentPostsList() {
  const { data, isLoading, isError, refetch } = useRecentPosts();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRetry = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

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
          <p className='text-muted-foreground mb-8 max-w-sm'>
            We ran into a hiccup fetching the latest articles. Please check your
            connection and try again.
          </p>
          <Button
            onClick={handleRetry}
            disabled={isRefetching}
            size='lg'
            className='min-w-35'
          >
            {isRefetching ? (
              <>
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                Retrying...
              </>
            ) : (
              'Try Again'
            )}
          </Button>
        </div>
      </section>
    );
  }

  const posts = data ?? [];

  return (
    <section className='container px-4 md:px-0 mx-auto mt-10 md:mt-16'>
      <div className='mb-10 flex flex-col items-center gap-2 md:mb-16 md:flex-row md:gap-20'>
        <h1 className='text-center text-3xl font-extrabold italic md:text-7xl'>
          Latest Article
        </h1>
        <Button
          variant='outline'
          className='flex w-full items-center justify-center space-x-4 px-8 py-4 md:w-auto md:space-x-10 md:px-20 md:py-6'
        >
          <p className='text-base md:text-lg'>View All</p>
          <MoveUpRight className='h-5 w-5 md:h-6 md:w-6' />
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {isLoading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <PostSkeleton key={index} />
          ))
        ) : posts.length > 0 ? (
          posts.map((post: articleInterFace) => (
            <PostCard key={post.id} data={post} />
          ))
        ) : (
          <p className='text-muted-foreground col-span-full text-center'>
            No articles available yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PostCard
// ---------------------------------------------------------------------------

export function PostCard({ data }: { data: articleInterFace }) {
  return (
    <Link
      href={createSlug({ id: data.id, name: data.title })}
      className='group block'
    >
      <Card className='h-full overflow-hidden shadow-md transition-shadow hover:shadow-lg'>
        <div className='relative h-48 sm:h-64'>
          <Image
            src={data.coverImage || '/default-image.jpg'}
            alt={data.title}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {data.category && (
            <Badge className='absolute left-4 top-4 z-10'>
              {data.category}
            </Badge>
          )}
        </div>

        <div className='p-4 sm:p-6'>
          <h2 className='mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary sm:text-2xl'>
            {data.title}
          </h2>

          <div className='flex items-center justify-between text-xs sm:text-sm'>
            <div className='flex items-center space-x-2 sm:space-x-4'>
              <Avatar>
                <AvatarImage src={data.author?.image} alt={data.author?.name} />
                <AvatarFallback>
                  {data.author?.name?.charAt(0) ?? 'A'}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className='font-semibold'>{data.author?.name ?? 'Author'}</p>
                <time
                  className='flex items-center text-muted-foreground'
                  dateTime={data.updatedAt}
                >
                  <Calendar className='mr-1 h-3 w-3' />
                  {formatDistanceToNow(new Date(data.updatedAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>

            <div className='flex items-center text-muted-foreground'>
              <MessageCircle className='mr-1 h-4 w-4' />
              <span>{data._count?.comments ?? 0}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

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
