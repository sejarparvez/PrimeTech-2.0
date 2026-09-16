'use client';

import { AlertCircle, MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { PostCard, PostSkeleton } from '@/app/(pages)/(home)/RecentPost';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useArticles } from '@/services/article';

const PAGE_SIZE = 24;

export default function ArticlesPage() {
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isPlaceholderData,
  } = useArticles({
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
      <>
        <Navbar />
        <main className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center'>
          <div className='bg-destructive/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
            <AlertCircle className='text-destructive h-10 w-10' />
          </div>
          <h2 className='mb-2 text-2xl font-bold tracking-tight'>
            Couldn't load articles
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
        <div className='mb-10 flex flex-col items-center justify-between gap-4 md:mb-16 md:flex-row md:items-end'>
          <div className='space-y-1 text-center md:text-left'>
            <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl'>
              Articles
            </h1>
            <p className='text-muted-foreground'>
              Explore all our stories and guides.
            </p>
          </div>

          <Link href='/' className='group hidden md:block'>
            <Button variant='outline' size='lg' className='group'>
              Back to Home
              <MoveUpRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
            </Button>
          </Link>
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
                No articles available yet.
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
