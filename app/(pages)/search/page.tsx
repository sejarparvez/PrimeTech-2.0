'use client';

import { AlertCircle, SearchX } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { PostCard, PostSkeleton } from '@/app/(pages)/(home)/RecentPost';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles } from '@/services/article';

const PAGE_SIZE = 24;

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<SearchFallback />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';

  const [page, setPage] = useState(1);

  // Reset to first page whenever the query changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter change
  useEffect(() => {
    setPage(1);
  }, [q]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isPlaceholderData,
  } = useArticles({
    search: q,
    limit: PAGE_SIZE,
    page,
  });

  const articles = response?.data ?? [];
  const meta = response?.meta;

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) {
    return (
      <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
          <AlertCircle className='text-destructive h-10 w-10' />
        </div>
        <h2 className='mb-2 text-2xl font-bold tracking-tight'>
          Couldn't search articles
        </h2>
        <Button onClick={() => refetch()} variant='outline' className='mt-4'>
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
      <div className='mb-10 space-y-1 text-center md:mb-16 md:text-left'>
        <p className='text-sm text-muted-foreground uppercase tracking-widest'>
          Search results
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl break-words'>
          &ldquo;{q}&rdquo;
        </h1>
        {meta && !isLoading && (
          <p className='text-muted-foreground'>
            {meta.total} {meta.total === 1 ? 'article' : 'articles'} found
          </p>
        )}
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {isLoading || !q ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
            <PostSkeleton key={i} />
          ))
        ) : articles.length > 0 ? (
          articles.map((post) => <PostCard key={post.id} data={post} />)
        ) : (
          <div className='col-span-full flex flex-col items-center gap-2 py-20 text-center border-2 border-dashed rounded-2xl'>
            <SearchX className='h-10 w-10 text-muted-foreground/50' />
            <p className='text-muted-foreground'>
              No articles matched your search.
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
  );
}

function SearchFallback() {
  return (
    <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
      <Skeleton className='mb-4 h-4 w-32' />
      <Skeleton className='mb-16 h-14 w-2/3' />
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
          <PostSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
