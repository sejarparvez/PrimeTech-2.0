'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentPosts } from '@/services/article';
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
import type { articleInterFace } from '../../../utils/interface';
import { createSlug } from '../../../utils/slug';

type Variant = 'featured' | 'horizontal';

// Describes where each post slot lives in the grid
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

// Minimum posts to attempt rendering the full grid at all
const MIN_POSTS = 3;

const ProgrammingPost: FC = () => {
  const { data, isLoading, isError, refetch } = useRecentPosts();
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

  if (isError) {
    return (
      <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
          <AlertCircle className='text-destructive h-10 w-10' />
        </div>
        <h2 className='mb-2 text-2xl font-bold tracking-tight'>
          Couldn't load the guide
        </h2>
        <p className='text-muted-foreground mb-8 max-w-100'>
          We ran into a technical hiccup while fetching the latest programming
          posts. Please check your connection and try again.
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
      </main>
    );
  }

  // Safely cap to whatever the API returned (up to 9)
  const posts = data?.slice(0, 9) ?? [];

  // Not enough posts to form a meaningful grid — show empty state
  if (posts.length < MIN_POSTS) {
    return (
      <main className='flex min-h-[40vh] flex-col items-center justify-center p-6 text-center'>
        <p className='text-muted-foreground text-lg'>
          No programming posts available yet. Check back soon.
        </p>
      </main>
    );
  }

  // Only render slots for which we actually have data
  const activeSlots = LAYOUT_SLOTS.filter(
    ({ dataIndex }) => dataIndex < posts.length,
  );

  // Partition into two rows (first 5 slots → row 1, remainder → row 2)
  const row1 = activeSlots.filter(({ dataIndex }) => dataIndex < 5);
  const row2 = activeSlots.filter(({ dataIndex }) => dataIndex >= 5);

  return (
    <section className='container pb-10 pt-10 md:pb-20 md:pt-16'>
      <div className='mb-10 flex flex-col items-center gap-4 md:mb-16 md:flex-row md:gap-20'>
        <h1 className='text-center text-3xl font-extrabold italic md:text-7xl'>
          Programming Guide
        </h1>
        <Button
          variant='outline'
          className='flex w-full items-center justify-center space-x-4 px-8 py-4 md:w-auto md:space-x-10 md:px-20 md:py-6'
        >
          <p className='text-base md:text-lg'>View All</p>
          <MoveUpRight className='h-5 w-5 md:h-6 md:w-6' />
        </Button>
      </div>

      {/* Row 1 */}
      <GridRow slots={row1} posts={posts} />

      {/* Row 2 */}
      {row2.length > 0 && (
        <div className='mt-4'>
          <GridRow slots={row2} posts={posts} />
        </div>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------------
// GridRow — renders one row of up to 5 slots in a 12-column grid
// ---------------------------------------------------------------------------

interface GridRowProps {
  slots: LayoutSlot[];
  posts: articleInterFace[];
}

const GridRow: FC<GridRowProps> = ({ slots, posts }) => {
  // Group consecutive horizontal slots into pairs so they share a column
  const columns = groupIntoColumns(slots);

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
      {columns.map((col, colIdx) => {
        if (col.length === 1 && col[0].variant === 'featured') {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <div key={colIdx} className='md:col-span-4'>
              <PostCard post={posts[col[0].dataIndex]} variant='featured' />
            </div>
          );
        }

        // One or two horizontal cards stacked in the same column
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            key={colIdx}
            className='grid grid-cols-1 gap-4 md:col-span-4 md:gap-4'
          >
            {col.map((slot) => (
              <PostCard
                key={slot.dataIndex}
                post={posts[slot.dataIndex]}
                variant='horizontal'
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Groups slots so that consecutive horizontal slots share a column group,
 * and featured slots each get their own column group.
 */
function groupIntoColumns(slots: LayoutSlot[]): LayoutSlot[][] {
  const columns: LayoutSlot[][] = [];
  let i = 0;

  while (i < slots.length) {
    const slot = slots[i];

    if (slot.variant === 'featured') {
      columns.push([slot]);
      i++;
    } else {
      // Grab up to 2 consecutive horizontal slots
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

// ---------------------------------------------------------------------------
// PostCard
// ---------------------------------------------------------------------------

interface PostCardProps {
  post: articleInterFace;
  variant: Variant;
}

const PostCard: FC<PostCardProps> = ({ post, variant }) => (
  <Link href={`${createSlug({ id: post.id, name: post.title })}`}>
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        variant === 'horizontal' ? 'flex h-64' : 'h-64 md:h-132'
      }`}
    >
      <Image
        src={post.coverImage || '/default-image.jpg'}
        alt={`Cover image for ${post.title}`}
        width={variant === 'horizontal' ? 300 : 800}
        height={variant === 'horizontal' ? 256 : 528}
        className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
        priority={variant === 'featured'}
      />
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent' />
      <div className='relative flex h-full flex-col justify-end p-6 text-white'>
        <h3
          className={`mb-2 font-bold ${
            variant === 'featured' ? 'text-xl md:text-4xl' : 'text-xl'
          }`}
        >
          {post.title}
        </h3>
        {variant === 'featured' && post.author && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Avatar className='h-8 w-8 border-2 border-white'>
                <AvatarImage src={post.author.image} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium'>{post.author.name}</p>
                <p className='text-xs text-gray-300'>
                  {formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <MessageCircle className='h-4 w-4' />
              <span className='text-xs'>{post._count.comments}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  </Link>
);

// ---------------------------------------------------------------------------
// SkeletonFeaturedPosts
// ---------------------------------------------------------------------------

const SkeletonFeaturedPosts: FC = () => (
  <section className='container mx-auto px-4 py-16 md:py-24'>
    <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
      <div className='md:col-span-8'>
        <Card className='relative h-64 overflow-hidden md:h-132'>
          <Skeleton className='absolute inset-0 h-full w-full' />
        </Card>
      </div>
      <div className='space-y-4 md:col-span-4'>
        {[0, 1].map((index) => (
          <Card
            key={index}
            className='relative flex h-48 overflow-hidden md:h-64'
          >
            <Skeleton className='absolute inset-0 h-full w-full' />
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default ProgrammingPost;
