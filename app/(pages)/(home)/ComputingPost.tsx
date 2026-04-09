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

interface LayoutSlot {
  variant: Variant;
  dataIndex: number;
}

// Grid shape: featured(0), horizontal(1-4), featured(5)
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
  const { isLoading, data, isError, refetch } = useRecentPosts();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRetry = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  if (isLoading) {
    return <SkeletonComputingPost />;
  }

  if (isError) {
    return (
      <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
          <AlertCircle className='text-destructive h-10 w-10' />
        </div>
        <h2 className='mb-2 text-2xl font-bold tracking-tight'>
          Couldn't load posts
        </h2>
        <p className='text-muted-foreground mb-8 max-w-sm'>
          We ran into a hiccup fetching the latest laptops & computers posts.
          Please check your connection and try again.
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

  const posts = data?.slice(0, 6) ?? [];

  if (posts.length < MIN_POSTS) {
    return (
      <main className='flex min-h-[40vh] flex-col items-center justify-center p-6 text-center'>
        <p className='text-muted-foreground text-lg'>
          No posts available yet. Check back soon.
        </p>
      </main>
    );
  }

  const activeSlots = LAYOUT_SLOTS.filter(
    ({ dataIndex }) => dataIndex < posts.length,
  );

  return (
    <div className='container'>
      <div className='mb-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-20'>
        <h1 className='text-center text-4xl font-extrabold italic md:text-7xl'>
          Laptops & Computers
        </h1>
        <Button
          variant='outline'
          className='flex w-full items-center justify-center space-x-4 px-8 py-4 md:w-auto md:space-x-10 md:px-20 md:py-6'
        >
          <p className='text-base md:text-lg'>View All</p>
          <MoveUpRight className='h-5 w-5 md:h-6 md:w-6' />
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-5'>
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
        variant === 'horizontal' ? 'flex h-72 md:h-full' : 'h-72'
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
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-xl'
          }`}
        >
          {post.title}
        </h3>
        {variant === 'horizontal' && post.author && (
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
// SkeletonComputingPost
// ---------------------------------------------------------------------------

const SkeletonComputingPost: FC = () => (
  <div className='container'>
    <div className='grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-5'>
      <div className='md:col-span-2 md:row-span-2'>
        <Card className='relative h-72 overflow-hidden'>
          <Skeleton className='absolute inset-0 h-full w-full' />
        </Card>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className='md:row-span-3'>
          <Card className='relative h-72 overflow-hidden md:h-full'>
            <Skeleton className='absolute inset-0 h-full w-full' />
          </Card>
        </div>
      ))}
      <div className='md:col-span-2 md:row-span-2'>
        <Card className='relative h-72 overflow-hidden'>
          <Skeleton className='absolute inset-0 h-full w-full' />
        </Card>
      </div>
    </div>
  </div>
);
