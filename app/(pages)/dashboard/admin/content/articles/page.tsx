'use client';

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInitials } from '@/lib/utils';
import { useAdminArticles, useAdminDeleteArticle } from '@/services/article';

const STATUS_VARIANTS = {
  PUBLISHED: 'default' as const,
  DRAFT: 'secondary' as const,
  ARCHIVED: 'outline' as const,
};

export default function ArticlesManagementPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isPending, isError } = useAdminArticles({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter,
  });

  const { mutate: deleteArticle, isPending: isDeleting } =
    useAdminDeleteArticle();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteArticle(deleteId, {
        onSuccess: () => setDeleteId(null),
        onError: () => setDeleteId(null),
      });
    }
  };

  if (isPending) return <ArticlesTableSkeleton />;

  if (isError) {
    return (
      <div className='flex h-100 flex-col items-center justify-center p-6 text-center'>
        <FileText className='h-10 w-10 text-muted-foreground mb-4' />
        <h3 className='text-lg font-medium'>Failed to load articles</h3>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const articles = data?.data || [];
  const meta = data?.meta;

  return (
    <div className='space-y-6 p-4 md:p-8 max-w-7xl mx-auto'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-extrabold tracking-tight md:text-4xl'>
            Articles
          </h1>
          <p className='text-muted-foreground text-sm md:text-base'>
            Manage all articles in your system.
          </p>
        </div>
        <Link
          href='/dashboard/content/write-article'
          className='w-full sm:w-auto'
        >
          <Button className='w-full sm:w-auto shadow-md'>
            <Plus className='mr-2 h-4 w-4' /> New Article
          </Button>
        </Link>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search articles...'
            className='pl-10 h-11 bg-background shadow-sm'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full sm:w-[180px] h-11'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All Status</SelectItem>
            <SelectItem value='PUBLISHED'>Published</SelectItem>
            <SelectItem value='DRAFT'>Draft</SelectItem>
            <SelectItem value='ARCHIVED'>Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {articles.length === 0 ? (
        <div className='text-center py-20 border-2 border-dashed rounded-xl bg-muted/10'>
          <FileText className='h-10 w-10 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground'>
            {searchQuery || statusFilter !== 'ALL'
              ? 'No articles match your filters.'
              : 'No articles found.'}
          </p>
        </div>
      ) : (
        <>
          <div className='rounded-lg border bg-card'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[300px]'>Article</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className='flex items-center gap-4'>
                        <div className='relative h-12 w-20 rounded-md overflow-hidden bg-muted shrink-0'>
                          {article.coverImage ? (
                            <Image
                              src={article.coverImage}
                              alt={article.title}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='flex items-center justify-center h-full'>
                              <FileText className='h-6 w-6 text-muted-foreground' />
                            </div>
                          )}
                        </div>
                        <div className='flex flex-col gap-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium truncate max-w-[180px]'>
                              {article.title}
                            </span>
                            {article.isFeatured && (
                              <Star className='h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0' />
                            )}
                          </div>
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <Badge
                              variant='outline'
                              className='text-[10px] px-1 py-0'
                            >
                              {article.category.name}
                            </Badge>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar size='sm'>
                          <AvatarImage src={article.author.image} />
                          <AvatarFallback>
                            {getInitials(article.author.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-sm truncate max-w-[100px]'>
                          {article.author.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[article.status]}>
                        {article.status.charAt(0) +
                          article.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Eye className='h-4 w-4' />
                          {article.views}
                        </span>
                        <span className='flex items-center gap-1'>
                          <FileText className='h-4 w-4' />
                          {article._count.comments}
                        </span>
                        <span className='flex items-center gap-1'>
                          <User className='h-4 w-4' />
                          {article._count.likes}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48'>
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(`/article/${article.slug}`, '_blank')
                            }
                          >
                            <Eye className='mr-2 h-4 w-4' /> Preview
                          </DropdownMenuItem>
                          <Link
                            href={`/dashboard/content/edit-article/${article.slug}`}
                          >
                            <DropdownMenuItem>
                              <Pencil className='mr-2 h-4 w-4' /> Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-destructive focus:bg-destructive/10 focus:text-destructive'
                            onClick={() => setDeleteId(article.id)}
                          >
                            <Trash2 className='mr-2 h-4 w-4' /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                Showing {(page - 1) * 10 + 1} to{' '}
                {Math.min(page * 10, meta.total)} of {meta.total} articles
              </p>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className='h-4 w-4 mr-1' /> Previous
                </Button>
                <div className='flex items-center gap-1'>
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, idx: number) => {
                      let pageNum: number;
                      if (meta.totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (page <= 3) {
                        pageNum = idx + 1;
                      } else if (page >= meta.totalPages - 2) {
                        pageNum = meta.totalPages - 4 + idx;
                      } else {
                        pageNum = page - 2 + idx;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size='sm'
                          className='w-9'
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    },
                  )}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={page === meta.totalPages}
                >
                  Next <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ArticlesTableSkeleton() {
  return (
    <div className='space-y-6 p-4 md:p-8 max-w-7xl mx-auto'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-11 w-full sm:w-36' />
      </div>
      <div className='flex flex-col gap-4 sm:flex-row'>
        <Skeleton className='h-11 flex-1' />
        <Skeleton className='h-11 w-full sm:w-[180px]' />
      </div>
      <div className='rounded-lg border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[300px]'>Article</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((idx) => (
              <TableRow key={`skeleton-row-${idx}`}>
                <TableCell>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-12 w-20 rounded-md' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-[180px]' />
                      <Skeleton className='h-3 w-[120px]' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <Skeleton className='h-4 w-[80px]' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[80px] rounded-full' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-12' />
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <Skeleton className='h-8 w-8 ml-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
