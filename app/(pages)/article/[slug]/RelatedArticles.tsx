'use client';

import { PostCard } from '@/app/(pages)/(home)/RecentPost';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticles } from '@/services/article';

interface RelatedArticlesProps {
  categorySlug: string;
  currentSlug: string;
}

export default function RelatedArticles({
  categorySlug,
  currentSlug,
}: RelatedArticlesProps) {
  const { data: response, isLoading } = useArticles({
    category: categorySlug,
    limit: 4,
  });

  const related = (response?.data ?? [])
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 3);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className='mx-auto mt-16 w-full max-w-5xl'>
      <h2 className='mb-6 text-2xl font-bold tracking-tight'>
        Related Articles
      </h2>
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
              <Skeleton key={i} className='h-80 w-full rounded-xl' />
            ))
          : related.map((post) => <PostCard key={post.id} data={post} />)}
      </div>
    </section>
  );
}
