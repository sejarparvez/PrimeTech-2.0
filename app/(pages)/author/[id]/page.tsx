'use client';

import { AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostCard, PostSkeleton } from '@/app/(pages)/(home)/RecentPost';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthor } from '@/services/article';

const PAGE_SIZE = 24;

export default function AuthorPage() {
  const params = useParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? '');

  const [page, setPage] = useState(1);

  // Reset to first page whenever the author changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter change
  useEffect(() => {
    setPage(1);
  }, [id]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isPlaceholderData,
  } = useAuthor(id, page, PAGE_SIZE);

  const author = response?.data;
  const articles = author?.articles ?? [];
  const meta = author?.meta;

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) {
    return (
      <>
        <Navbar />
        <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
          <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
            <AlertCircle className='text-destructive h-10 w-10' />
          </div>
          <h2 className='mb-2 text-2xl font-bold tracking-tight'>
            Couldn't load author
          </h2>
          <Button onClick={() => refetch()} variant='outline' className='mt-4'>
            Try Again
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
        <div className='mb-10 flex flex-col items-center gap-4 text-center md:mb-16 md:flex-row md:text-left'>
          {isLoading || !author ? (
            <>
              <div className='bg-muted h-24 w-24 shrink-0 animate-pulse rounded-full' />
              <div className='w-full max-w-sm space-y-2'>
                <div className='bg-muted h-8 animate-pulse rounded' />
                <div className='bg-muted h-4 animate-pulse rounded' />
              </div>
            </>
          ) : (
            <>
              <Avatar className='h-24 w-24 shrink-0'>
                <AvatarImage src={author.image ?? undefined} />
                <AvatarFallback className='text-3xl'>
                  {author.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-1'>
                <h1 className='text-3xl font-extrabold italic tracking-tight md:text-5xl'>
                  {author.name}
                </h1>
                {author.bio && (
                  <p className='text-muted-foreground'>{author.bio}</p>
                )}
                <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                  {meta?.total ?? 0}{' '}
                  {(meta?.total ?? 0) === 1 ? 'article' : 'articles'}
                </p>
              </div>
            </>
          )}
        </div>

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {isLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
              <PostSkeleton key={i} />
            ))
          ) : articles.length > 0 ? (
            articles.map((post) => <PostCard key={post.id} data={post} />)
          ) : (
            <div className='col-span-full py-20 text-center border-2 border-dashed rounded-2xl'>
              <p className='text-muted-foreground'>
                No articles from this author yet.
              </p>
            </div>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className='mt-12 flex items-center justify-center gap-4'>
            <Button
              variant='ghost'
              disabled={page === 1 || isPlaceholderData}
              onClick={() => goToPage(Math.max(page - 1, 1))}
            >
              Previous
            </Button>
            <span className='text-sm font-medium'>
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant='ghost'
              disabled={!meta.hasMore || isPlaceholderData}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
