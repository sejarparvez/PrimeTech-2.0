"use client";

import { articleCategories } from "@/app/constants/articleCategory";
import { useDashboardArticle } from "@/app/services/article";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { articleInterFace } from "@/utils/interface";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit, Eye, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import ArticlePagination from "./PaginationUi";

export default function ArticleList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("query") || "",
  );

  const handleFilterChange = useCallback(
    (value: string) => {
      setCategory(value);
      router.push(
        `/dashboard/all-article?category=${value}&query=${searchQuery}&page=1`,
      );
    },
    [router, searchQuery],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
      router.push(
        `/dashboard/all-article?category=${category}&query=${newQuery}&page=1`,
      );
    },
    [router, category],
  );

  const handleSearch = useCallback(() => {
    router.push(
      `/dashboard/all-article?category=${category}&query=${searchQuery}&page=1`,
    );
  }, [router, category, searchQuery]);

  const categoryName = searchParams.get("category") || "All";
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
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
                    value={category.value.toLowerCase().replace(/\s+/g, "_")}
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
            {isLoading ? "Loading..." : "Filter"}
          </Button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
            {isLoading ? "Loading..." : "Search"}
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
                    <ArticleCard key={article.id} article={article} />
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

function ArticleCard({ article }: { article: articleInterFace }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-700/25">
        <div className="relative aspect-[16/10]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover brightness-50 transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardHeader className="absolute bottom-0 left-0 right-0 mb-16 p-4 md:mb-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-start justify-between">
              <Badge className="mb-2">{article.category}</Badge>
              <div className="flex items-center space-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:hidden lg:flex">
                <Button size="icon" variant="secondary">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="mb-1 line-clamp-2 text-base text-white sm:text-lg">
              {article.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 sm:text-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={article.author?.image}
                  alt={article.author?.name}
                />
                <AvatarFallback className="text-primary">
                  {article.author?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{article.author?.name}</span>
              <div className="flex flex-wrap items-center">
                <span className="mx-2">•</span>
                <Calendar className="mr-1 h-4 w-4" />
                <time dateTime={article.updatedAt}>
                  {formatDistanceToNow(new Date(article.updatedAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="justify-end space-x-1 p-4 sm:flex lg:hidden">
          <Button size="sm" variant="secondary">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button size="sm" variant="secondary">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button size="sm" variant="secondary">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="relative overflow-hidden">
          <div className="relative aspect-[16/10]">
            <Skeleton className="absolute inset-0" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Skeleton className="mb-2 h-5 w-20" />
            <Skeleton className="mb-1 h-6 w-3/4" />
            <div className="mt-2 flex items-center">
              <Skeleton className="mr-2 h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
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
