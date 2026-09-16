'use client';

import Link from 'next/link';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthors } from '@/services/article';

export default function AuthorsPage() {
  const { data: response, isLoading } = useAuthors();
  const authors = response?.data ?? [];

  return (
    <>
      <Navbar />
      <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
        <div className='mb-10 space-y-1 text-center md:mb-16 md:text-left'>
          <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl'>
            Authors
          </h1>
          <p className='text-muted-foreground'>
            The writers behind our stories.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
              <Card key={i} className='p-6'>
                <CardContent className='flex flex-col items-center gap-3 p-0 text-center'>
                  <Skeleton className='h-20 w-20 rounded-full' />
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-2/3' />
                </CardContent>
              </Card>
            ))
          ) : authors.length > 0 ? (
            authors.map((author) => (
              <Link key={author.id} href={`/author/${author.id}`}>
                <Card className='h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
                  <CardContent className='flex flex-col items-center gap-3 p-6 text-center'>
                    <Avatar className='h-20 w-20'>
                      <AvatarImage src={author.image ?? undefined} />
                      <AvatarFallback className='text-2xl'>
                        {author.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className='text-xl font-bold'>{author.name}</h2>
                    {author.bio && (
                      <p className='line-clamp-2 text-sm text-muted-foreground'>
                        {author.bio}
                      </p>
                    )}
                    <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                      {author._count.Articles}{' '}
                      {author._count.Articles === 1 ? 'article' : 'articles'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className='col-span-full py-20 text-center border-2 border-dashed rounded-2xl'>
              <p className='text-muted-foreground'>No authors yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
