'use client';

import { formatDistanceToNow } from 'date-fns';
import { FileQuestion, MessageCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { useFeaturedArticles } from '@/app/services/article';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { articleInterFace } from '../../../utils/interface';
import { createSlug } from '../../../utils/slug';

export default function Featured() {
  const { data, isLoading, isError, refetch } = useFeaturedArticles();

  if (isLoading) {
    return <SkeletonFeaturedPosts />;
  }

  if (isError) {
    return (
      <section className='container flex min-h-100 flex-col items-center justify-center space-y-4 text-center'>
        <div className='rounded-full bg-destructive/10 p-4'>
          <FileQuestion className='h-8 w-8 text-destructive' />
        </div>
        <div>
          <h2 className='text-xl font-semibold'>Failed to load articles</h2>
          <p className='text-muted-foreground'>
            We couldn't reach the soul of Bangladesh right now.
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline'>
          Try Again
        </Button>
      </section>
    );
  }

  // Handle Empty Data
  if (!data || data.length === 0) {
    return (
      <section className='container py-12'>
        <Card className='flex flex-col items-center justify-center border-dashed p-12 text-center'>
          <TrendingUp className='mb-4 h-12 w-12 text-muted-foreground/40' />
          <h2 className='text-2xl font-bold tracking-tight'>
            No featured stories yet
          </h2>
          <p className='text-muted-foreground mt-2 max-w-sm'>
            We're currently scouting for the best destinations to showcase.
            Check back soon!
          </p>
        </Card>
      </section>
    );
  }

  // Destructure with fallbacks to prevent undefined errors
  const [mainPost, ...secondaryPosts] = data;

  return (
    <section className='container pt-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
        {/* Main Featured Post */}
        <div className='md:col-span-8'>
          <PostCard post={mainPost} variant='featured' />
        </div>

        {/* Secondary Posts (Checks if they exist) */}
        <div className='grid grid-cols-1 gap-4 md:col-span-4 md:gap-3'>
          {secondaryPosts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} variant='horizontal' />
          ))}

          {/* Fallback if only 1 or 2 posts exist total */}
          {data.length < 3 && data.length > 0 && (
            <div className='hidden md:flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-4 text-center'>
              <p className='text-xs text-muted-foreground'>
                More stories coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface PostCardProps {
  post: articleInterFace;
  variant: 'featured' | 'horizontal';
}

const PostCard: FC<PostCardProps> = ({ post, variant }) => {
  if (!post) return null;

  return (
    <Link
      href={createSlug({ id: post.id, name: post.title })}
      className='block'
    >
      <Card
        className={`group relative overflow-hidden border-none transition-all duration-500 hover:shadow-2xl ${
          variant === 'horizontal' ? 'h-48 md:h-64' : 'h-87.5 md:h-136'
        }`}
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority={variant === 'featured'}
          className='absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110'
        />

        {/* Improved Overlay Gradient */}
        <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90' />

        <div className='relative flex h-full flex-col justify-end p-4 text-white md:p-8'>
          {variant === 'featured' && (
            <span className='mb-3 w-fit rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground'>
              Featured Story
            </span>
          )}

          <h3
            className={`font-bold leading-tight transition-colors group-hover:text-primary-foreground/90 ${
              variant === 'featured'
                ? 'text-2xl md:text-5xl lg:max-w-2xl'
                : 'text-lg md:text-xl line-clamp-2'
            }`}
          >
            {post.title}
          </h3>

          {variant === 'featured' && (
            <div className='mt-6 flex items-center justify-between border-t border-white/10 pt-6'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10 border-2 border-primary/20'>
                  <AvatarImage src={post.author.image} alt={post.author.name} />
                  <AvatarFallback className='text-black'>
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-semibold'>{post.author.name}</p>
                  <p className='text-xs text-gray-400'>
                    {formatDistanceToNow(new Date(post.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md'>
                <MessageCircle className='h-4 w-4 text-primary' />
                <span className='text-xs font-medium'>
                  {post._count.comments}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

const SkeletonFeaturedPosts = () => (
  <section className='container pt-4'>
    <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
      <div className='md:col-span-8'>
        <Skeleton className='h-87.5 w-full rounded-xl md:h-136' />
      </div>
      <div className='grid grid-cols-1 gap-4 md:col-span-4'>
        <Skeleton className='h-48 w-full rounded-xl md:h-64' />
        <Skeleton className='h-48 w-full rounded-xl md:h-64' />
      </div>
    </div>
  </section>
);
