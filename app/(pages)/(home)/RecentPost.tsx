'use client';

import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, MessageCircle, MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles } from '@/services/article';
import type { ArticleListType } from '@/types/article';

export default function LatestPost() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useArticles({
    limit: 1,
  });

  const latest = response?.data?.[0];

  if (isError) {
    return (
      <section className='container mx-auto mt-10 px-4 md:mt-16 md:px-0'>
        <div className='flex min-h-[40vh] flex-col items-center justify-center p-6 text-center'>
          <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
            <AlertCircle className='text-destructive h-10 w-10' />
          </div>
          <h2 className='mb-2 text-2xl font-bold tracking-tight'>
            Couldn't load the latest article
          </h2>
          <Button onClick={() => refetch()} variant='outline' className='mt-4'>
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className='container mx-auto mt-16 px-4 md:px-0'>
      <div className='mb-8 flex flex-col items-center justify-between gap-4 md:mb-12 md:flex-row md:items-end'>
        <div className='space-y-1 text-center md:text-left'>
          <h2 className='text-3xl font-extrabold italic md:text-5xl tracking-tight'>
            Latest Article
          </h2>
          <p className='text-muted-foreground'>
            Our most recent story, hot off the press.
          </p>
        </div>

        <Link href='/articles'>
          <Button variant='outline' size='lg' className='group'>
            View All
            <MoveUpRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LatestHeroSkeleton />
      ) : latest ? (
        <LatestHero data={latest} />
      ) : (
        <div className='flex min-h-[30vh] items-center justify-center rounded-2xl border-2 border-dashed border-border'>
          <p className='text-muted-foreground'>No articles available yet.</p>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// LatestHero (single latest article)
// ---------------------------------------------------------------------------

function LatestHero({ data }: { data: ArticleListType }) {
  return (
    <Link href={`/article/${data.slug}`} className='group block'>
      <Card className='grid grid-cols-1 overflow-hidden border-none bg-background p-0 shadow-sm transition-all duration-300 hover:shadow-xl lg:grid-cols-2'>
        <div className='relative min-h-64 overflow-hidden sm:min-h-96'>
          <Image
            src={data.coverImage || '/placeholder.jpg'}
            alt={data.title}
            fill
            priority
            sizes='(max-width: 1024px) 100vw, 50vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        </div>

        <div className='flex flex-col justify-center p-6 sm:p-10'>
          {data.category && (
            <Badge className='mb-4 w-fit bg-muted text-foreground hover:bg-muted'>
              {data.category.name}
            </Badge>
          )}

          <h3 className='mb-4 text-2xl font-extrabold leading-tight transition-colors group-hover:text-primary sm:text-4xl'>
            {data.title}
          </h3>

          {data.excerpt && (
            <p className='mb-6 line-clamp-3 text-muted-foreground'>
              {data.excerpt}
            </p>
          )}

          <div className='mt-2 flex items-center justify-between border-t pt-6'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={data.author?.image} />
                <AvatarFallback>{data.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-bold'>{data.author?.name}</p>
                <time className='text-xs text-muted-foreground uppercase tracking-widest'>
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

function LatestHeroSkeleton() {
  return (
    <Card className='grid grid-cols-1 overflow-hidden border-none bg-background p-0 lg:grid-cols-2'>
      <div className='min-h-64 sm:min-h-96'>
        <Skeleton className='h-full w-full rounded-none' />
      </div>
      <div className='p-6 sm:p-10'>
        <Skeleton className='mb-4 h-6 w-24' />
        <Skeleton className='mb-4 h-10 w-3/4' />
        <Skeleton className='mb-2 h-4 w-full' />
        <Skeleton className='mb-2 h-4 w-2/3' />
        <div className='mt-8 flex items-center justify-between border-t pt-6'>
          <div className='flex items-center space-x-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div>
              <Skeleton className='mb-1 h-4 w-20' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
          <Skeleton className='h-4 w-8' />
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// PostCard (Updated for new Schema) - reused by the /articles listing page
// ---------------------------------------------------------------------------

export function PostCard({ data }: { data: ArticleListType }) {
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