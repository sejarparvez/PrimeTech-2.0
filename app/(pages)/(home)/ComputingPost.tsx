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

type Variant = 'featured' | 'horizontal';

interface LayoutSlot {
  variant: Variant;
  dataIndex: number;
}

const LAYOUT_SLOTS: LayoutSlot[] = [
  { variant: 'featured', dataIndex: 0 },
  { variant: 'horizontal', dataIndex: 1 },
  { variant: 'horizontal', dataIndex: 2 },
  { variant: 'horizontal', dataIndex: 3 },
  { variant: 'horizontal', dataIndex: 4 },
  { variant: 'featured', dataIndex: 5 },
];

const MIN_POSTS = 1;

export default function ComputingPost() {
  // 1. Update to use the paginated response
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useArticles({
    limit: 6,
    // Add category filter if you have a specific 'computing' or 'laptops' category
    // category: 'computing'
  });

  const [isRefetching, setIsRefetching] = useState(false);

  const handleRetry = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  if (isLoading) {
    return <SkeletonComputingPost />;
  }

  // 2. Safely access the data array from our new API structure
  const posts = response?.data || [];

  if (isError) {
    return (
      <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
          <AlertCircle className='text-destructive h-10 w-10' />
        </div>
        <h2 className='mb-2 text-2xl font-bold tracking-tight'>
          Couldn't load posts
        </h2>
        <Button onClick={handleRetry} disabled={isRefetching} size='lg'>
          {isRefetching ? (
            <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            'Try Again'
          )}
        </Button>
      </main>
    );
  }

  if (posts.length < MIN_POSTS) {
    return (
      <main className='flex min-h-[40vh] flex-col items-center justify-center p-6 text-center'>
        <p className='text-muted-foreground text-lg'>
          No computing posts available yet.
        </p>
      </main>
    );
  }

  const activeSlots = LAYOUT_SLOTS.filter(
    ({ dataIndex }) => dataIndex < posts.length,
  );

  return (
    <div className='container py-10'>
      <div className='mb-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-20'>
        <h1 className='text-center text-4xl font-extrabold italic md:text-7xl'>
          Laptops & Computers
        </h1>
        <Link href='/category/computing'>
          <Button
            variant='outline'
            className='flex w-full items-center space-x-4 px-8 py-6 md:w-auto md:px-20'
          >
            <p className='text-base md:text-lg'>View All</p>
            <MoveUpRight className='h-5 w-5' />
          </Button>
        </Link>
      </div>

      {/* Grid structure: 4 columns, 5 rows on desktop */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-5 md:h-[1000px]'>
        {activeSlots.map(({ variant, dataIndex }) => (
          <div
            key={dataIndex}
            className={
              variant === 'featured'
                ? 'md:col-span-2 md:row-span-2'
                : 'md:row-span-3'
            }
          >
            <PostCard post={posts[dataIndex]} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PostCard (Refactored for Article Model)
// ---------------------------------------------------------------------------

const PostCard: FC<{ post: any; variant: Variant }> = ({ post, variant }) => (
  <Link href={`/article/${post.slug}`} className='block h-full'>
    <Card className='group relative h-full overflow-hidden border-none shadow-md transition-all duration-500 hover:shadow-2xl'>
      <Image
        src={post.coverImage || '/placeholder.jpg'}
        alt={post.title}
        fill
        className='absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110'
        priority={variant === 'featured'}
      />
      {/* Dynamic gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

      <div className='relative flex h-full flex-col justify-end p-6 text-white'>
        <h3
          className={`font-bold leading-tight group-hover:text-primary-foreground/90 transition-colors ${
            variant === 'featured'
              ? 'text-2xl md:text-3xl mb-4'
              : 'text-xl mb-2 line-clamp-2'
          }`}
        >
          {post.title}
        </h3>

        {/* Show Author/Meta info on all variants for consistency, or keep your variant logic */}
        {post.author && (
          <div className='flex items-center justify-between border-t border-white/10 pt-4'>
            <div className='flex items-center space-x-2'>
              <Avatar className='h-7 w-7 border border-white/20'>
                <AvatarImage src={post.author.image} />
                <AvatarFallback className='text-black text-[10px]'>
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-xs font-semibold'>{post.author.name}</p>
                <p className='text-[10px] text-white/50'>
                  {formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-1 text-white/80'>
              <MessageCircle className='h-3 w-3' />
              <span className='text-[10px]'>{post._count?.comments || 0}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  </Link>
);

// ---------------------------------------------------------------------------
// Skeleton (Aligned with the 5-row grid)
// ---------------------------------------------------------------------------

const SkeletonComputingPost: FC = () => (
  <div className='container py-10'>
    <div className='grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-5 md:h-[1000px]'>
      <div className='md:col-span-2 md:row-span-2'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
      <div className='md:row-span-3'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
      <div className='md:row-span-3'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
      <div className='md:row-span-3'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
      <div className='md:row-span-3'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
      <div className='md:col-span-2 md:row-span-2'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
    </div>
  </div>
);
