'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  MessageCircle,
  MoveUpRight,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type FC, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles } from '@/services/article';
import type { ArticleListType } from '@/types/article';

// --- Layout Types & Configuration ---
type Variant = 'featured' | 'horizontal';

interface LayoutSlot {
  variant: Variant;
  dataIndex: number;
}

const LAYOUT_SLOTS: LayoutSlot[] = [
  { variant: 'horizontal', dataIndex: 0 },
  { variant: 'horizontal', dataIndex: 1 },
  { variant: 'featured', dataIndex: 2 },
  { variant: 'horizontal', dataIndex: 3 },
  { variant: 'horizontal', dataIndex: 4 },
  { variant: 'featured', dataIndex: 5 },
  { variant: 'horizontal', dataIndex: 6 },
  { variant: 'horizontal', dataIndex: 7 },
  { variant: 'featured', dataIndex: 8 },
];

const MIN_POSTS = 3;

const ProgrammingPost: FC = () => {
  // 1. Updated hook call to match paginated API
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useArticles({
    limit: 9, // We need up to 9 for this specific grid layout
  });

  const [isRefetching, setIsRefetching] = useState(false);

  const handleRetry = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  if (isLoading) {
    return (
      <main className='min-h-screen'>
        <SkeletonFeaturedPosts />
      </main>
    );
  }

  // 2. Extract articles from the response object
  const articles = response?.data || [];

  if (isError) {
    return (
      <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
          <AlertCircle className='text-destructive h-10 w-10' />
        </div>
        <h2 className='mb-2 text-2xl font-bold tracking-tight'>
          Couldn't load the guide
        </h2>
        <Button onClick={handleRetry} disabled={isRefetching} className='mt-4'>
          {isRefetching ? (
            <RefreshCw className='animate-spin mr-2 h-4 w-4' />
          ) : (
            'Try Again'
          )}
        </Button>
      </main>
    );
  }

  if (articles.length < MIN_POSTS) {
    return (
      <main className='flex min-h-[40vh] flex-col items-center justify-center p-6 text-center'>
        <p className='text-muted-foreground text-lg'>
          No programming posts available yet.
        </p>
      </main>
    );
  }

  // Filter slots based on how many articles we actually received
  const activeSlots = LAYOUT_SLOTS.filter(
    ({ dataIndex }) => dataIndex < articles.length,
  );
  const row1 = activeSlots.filter(({ dataIndex }) => dataIndex < 5);
  const row2 = activeSlots.filter(({ dataIndex }) => dataIndex >= 5);

  return (
    <section className='container pb-10 pt-10 md:pb-20 md:pt-16'>
      <div className='mb-10 flex flex-col items-center gap-4 md:mb-16 md:flex-row md:gap-20'>
        <h1 className='text-center text-3xl font-extrabold italic md:text-7xl'>
          Programming Guide
        </h1>
        <Link href='/articles'>
          <Button
            variant='outline'
            className='flex w-full items-center justify-center space-x-10 px-20 py-6'
          >
            <p className='text-lg'>View All</p>
            <MoveUpRight className='h-6 w-6' />
          </Button>
        </Link>
      </div>

      <GridRow slots={row1} posts={articles} />
      {row2.length > 0 && (
        <div className='mt-8'>
          <GridRow slots={row2} posts={articles} />
        </div>
      )}
    </section>
  );
};

// --- GridRow Component ---

interface GridRowProps {
  slots: LayoutSlot[];
  posts: ArticleListType[];
}

const GridRow: FC<GridRowProps> = ({ slots, posts }) => {
  const columns = groupIntoColumns(slots);

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
      {columns.map((col, colIdx) => {
        const isFeaturedCol = col.length === 1 && col[0].variant === 'featured';
        return (
          <div
            key={colIdx}
            className={`grid grid-cols-1 gap-4 md:col-span-4 ${!isFeaturedCol ? 'md:gap-8' : ''}`}
          >
            {col.map((slot) => (
              <PostCard
                key={slot.dataIndex}
                post={posts[slot.dataIndex]}
                variant={slot.variant}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

// --- PostCard Component ---

const PostCard: FC<{ post: ArticleListType; variant: Variant }> = ({
  post,
  variant,
}) => {
  if (!post) return null;

  return (
    <Link href={`/article/${post.slug}`} className='block h-full'>
      <Card
        className={`group relative overflow-hidden border-none transition-all duration-500 hover:shadow-2xl ${
          variant === 'horizontal' ? 'h-64' : 'h-64 md:h-136' // Fixed h-132 to pixel value
        }`}
      >
        <Image
          src={post.coverImage || '/placeholder.jpg'}
          alt={post.title}
          fill
          className='absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105'
          priority={variant === 'featured'}
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent' />

        <div className='relative flex h-full flex-col justify-end p-6 text-white'>
          <h3
            className={`mb-3 font-bold leading-tight ${variant === 'featured' ? 'text-2xl md:text-4xl' : 'text-xl line-clamp-2'}`}
          >
            {post.title}
          </h3>

          {variant === 'featured' && post.author && (
            <div className='mt-4 flex items-center justify-between border-t border-white/10 pt-4'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-8 w-8 border border-white/20'>
                  <AvatarImage src={post.author.image} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium'>{post.author.name}</p>
                  <p className='text-[10px] text-white/60 uppercase tracking-widest'>
                    {formatDistanceToNow(new Date(post.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <MessageCircle className='h-4 w-4 text-primary' />
                <span className='text-xs font-bold'>
                  {post._count?.comments || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

// --- Helper Functions & Skeleton ---

function groupIntoColumns(slots: LayoutSlot[]): LayoutSlot[][] {
  const columns: LayoutSlot[][] = [];
  let i = 0;
  while (i < slots.length) {
    const slot = slots[i];
    if (slot.variant === 'featured') {
      columns.push([slot]);
      i++;
    } else {
      const pair: LayoutSlot[] = [slot];
      if (i + 1 < slots.length && slots[i + 1].variant === 'horizontal') {
        pair.push(slots[i + 1]);
        i++;
      }
      columns.push(pair);
      i++;
    }
  }
  return columns;
}

const SkeletonFeaturedPosts: FC = () => (
  <section className='container mx-auto px-4 py-16 md:py-24'>
    <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
      <div className='md:col-span-8'>
        <Skeleton className='h-64 md:h-136 rounded-xl' />
      </div>
      <div className='md:col-span-4 space-y-8'>
        <Skeleton className='h-64 rounded-xl' />
        <Skeleton className='h-64 rounded-xl' />
      </div>
    </div>
  </section>
);

export default ProgrammingPost;
