'use client';

import { articleCategories } from '@/app/constants/articleCategory';
import { useDashboardArticle } from '@/app/services/article';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { articleInterFace } from '@/utils/interface';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { ArticleListSkeleton } from './ArticleSketon';
import ArticlePagination from './PaginationUi';

export default function ArticleList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('query') || ''
  );

  const handleFilterChange = useCallback(
    (value: string) => {
      setCategory(value);
      router.push(
        `/dashboard/all-article?category=${value}&query=${searchQuery}&page=1`
      );
    },
    [router, searchQuery]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
      router.push(
        `/dashboard/all-article?category=${category}&query=${newQuery}&page=1`
      );
    },
    [router, category]
  );

  const handleSearch = useCallback(() => {
    router.push(
      `/dashboard/all-article?category=${category}&query=${searchQuery}&page=1`
    );
  }, [router, category, searchQuery]);

  const categoryName = searchParams.get('category') || 'All';
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const { isLoading, data, isError, refetch } = useDashboardArticle({
    page,
    category: categoryName,
    searchQuery: query,
  });

  return (
    <div className="container mx-auto space-y-8 px-4">
      <h1 className="mb-8 text-center text-4xl font-bold">Article List</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select value={category} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All Categories</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                {articleCategories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value.toLowerCase().replace(/\s+/g, '_')}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Loading...' : 'Filter'}
          </Button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full sm:w-auto"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Loading...' : 'Search'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <ArticleListSkeleton />
      ) : isError ? (
        <ArticleListError />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {data?.data?.length ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((article: articleInterFace) => (
                    <ArticleCard key={article.id} article={article} refetch={refetch} />
                  ))}
                </div>
                <ArticlePagination totalPages={data.meta.totalPages} />
              </>
            ) : (
              <Alert>
                <AlertTitle>No articles found</AlertTitle>
                <AlertDescription>
                  Try adjusting your search or filter to find articles.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function ArticleListError() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was an error loading the articles. Please try again later or
        contact support if the problem persists.
      </AlertDescription>
    </Alert>
  );
}
