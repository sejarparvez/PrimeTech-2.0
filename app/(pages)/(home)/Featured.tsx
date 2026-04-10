'use client';

import { formatDistanceToNow } from 'date-fns';
import { FileQuestion, MessageCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles } from '@/services/article';
import type { ArticleListType } from '@/types/article';

export default function Featured() {
  // 1. Fetching from our new paginated API
  const {
    data: response,
    isPending,
    isError,
    refetch,
  } = useArticles({
    limit: 3,
    isFeatured: true,
  });

  // Access the array from the new response structure
  const articles = response?.data || [];

  if (isPending) {
    return <SkeletonFeaturedPosts />;
  }

  if (isError) {
    return (
      <section className='container mx-auto px-4 md:px-0 flex min-h-100 flex-col items-center justify-center space-y-4 text-center'>
        <div className='rounded-full bg-destructive/10 p-4'>
          <FileQuestion className='h-8 w-8 text-destructive' />
        </div>
        <div>
          <h2 className='text-xl font-semibold'>Failed to load articles</h2>
          <p className='text-muted-foreground'>
            We couldn't fetch the featured stories at the moment.
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline'>
          Try Again
        </Button>
      </section>
    );
  }

  // 2. Updated Empty State Check
  if (articles.length === 0) {
    return (
      <section className='container mx-auto px-4 md:px-0 py-12'>
        <Card className='flex flex-col items-center justify-center border-dashed p-12 text-center'>
          <TrendingUp className='mb-4 h-12 w-12 text-muted-foreground/40' />
          <h2 className='text-2xl font-bold tracking-tight'>
            No featured stories yet
          </h2>
          <p className='text-muted-foreground mt-2 max-w-sm'>
            Check back soon for our top picks!
          </p>
        </Card>
      </section>
    );
  }

  const [mainPost, ...secondaryPosts] = articles;

  return (
    <section className='container pt-4 mx-auto px-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8'>
        <div className='md:col-span-8'>
          <PostCard post={mainPost} variant='featured' />
        </div>

        <div className='grid grid-cols-1 gap-4 md:col-span-4 md:gap-3'>
          {secondaryPosts.map((post) => (
            <PostCard key={post.id} post={post} variant='horizontal' />
          ))}

          {/* Decorative fallback if only one post exists */}
          {articles.length < 3 && (
            <div className='hidden md:flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-4 text-center'>
              <p className='text-xs text-muted-foreground italic'>
                Fresh content arriving daily...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --- PostCard Sub-component ---

interface PostCardProps {
  post: ArticleListType;
  variant: 'featured' | 'horizontal';
}

const PostCard: FC<PostCardProps> = ({ post, variant }) => {
  if (!post) return null;

  // Use the slug from the DB instead of generating one via helper
  const articleHref = `/article/${post.slug}`;

  return (
    <Link href={articleHref} className='block'>
      <Card
        className={`group relative overflow-hidden border-none transition-all duration-500 hover:shadow-2xl ${
          variant === 'horizontal' ? 'h-48 md:h-64' : 'h-87.5 md:h-136'
        }`}
      >
        <Image
          src={post.coverImage || '/placeholder.jpg'}
          alt={post.title}
          fill
          priority={variant === 'featured'}
          className='absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105'
        />

        {/* Improved Overlay for Readability */}
        <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent' />

        <div className='relative flex h-full flex-col justify-end p-5 text-white md:p-8'>
          {variant === 'featured' && (
            <Badge className='mb-3 w-fit bg-primary hover:bg-primary text-[10px] uppercase font-bold'>
              Featured Story
            </Badge>
          )}

          <h3
            className={`font-bold leading-tight group-hover:text-primary-foreground/90 ${
              variant === 'featured'
                ? 'text-2xl md:text-5xl lg:max-w-3xl'
                : 'text-lg md:text-xl line-clamp-2'
            }`}
          >
            {post.title}
          </h3>

          {variant === 'featured' && post.author && (
            <div className='mt-6 flex items-center justify-between border-t border-white/10 pt-6'>
              <div className='flex items-center space-x-3'>
                <Avatar className='h-10 w-10 border-2 border-white/20'>
                  <AvatarImage src={post.author.image} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-semibold'>{post.author.name}</p>
                  <p className='text-xs text-white/60'>
                    {formatDistanceToNow(new Date(post.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md'>
                <MessageCircle className='h-4 w-4 text-primary-foreground' />
                <span className='text-xs font-medium'>
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

const SkeletonFeaturedPosts = () => (
  <section className='container mx-auto px-4 md:px-0 pt-4'>
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
