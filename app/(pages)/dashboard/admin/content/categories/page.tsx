'use client';

import {
  BookOpen,
  ExternalLink,
  Hash,
  Layers,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories, useDeleteCategory } from '@/services/categories';

export default function CategoryManagementPage() {
  const { data: categories, isPending, isError } = useCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  // State to track which category is being deleted
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic
  const filteredCategories = categories?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isPending) return <CategoryGridSkeleton />;

  if (isError) {
    return (
      <div className='flex h-100 flex-col items-center justify-center p-6 text-center'>
        <Layers className='h-10 w-10 text-muted-foreground mb-4' />
        <h3 className='text-lg font-medium'>Failed to load categories</h3>
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

  const handleDelete = () => {
    if (deleteId) {
      deleteCategory(deleteId, {
        onSuccess: () => setDeleteId(null),
        onError: () => setDeleteId(null),
      });
    }
  };

  return (
    <div className='space-y-8 p-4 md:p-8 max-w-7xl mx-auto'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-extrabold tracking-tight md:text-4xl'>
            Categories
          </h1>
          <p className='text-muted-foreground text-sm md:text-base'>
            Organize your content and help readers find what they need.
          </p>
        </div>
        <Link
          href='/dashboard/admin/content/categories/add'
          className='w-full sm:w-auto'
        >
          <Button className='w-full sm:w-auto shadow-md'>
            <Plus className='mr-2 h-4 w-4' /> New Category
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Search by name or slug...'
          className='pl-10 h-11 bg-background shadow-sm'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Responsive Grid */}
      {filteredCategories?.length === 0 ? (
        <div className='text-center py-20 border-2 border-dashed rounded-xl bg-muted/10'>
          <Layers className='h-10 w-10 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground'>No categories found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredCategories?.map((category) => (
            <Card
              key={category.id}
              className='group relative flex flex-col justify-between hover:shadow-md transition-all duration-200 border-muted-foreground/10'
            >
              <CardHeader className='p-5 pb-2'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='space-y-1.5'>
                    <h3 className='font-bold text-lg leading-tight group-hover:text-primary transition-colors'>
                      {category.name}
                    </h3>
                    <div className='flex items-center text-muted-foreground text-xs font-mono'>
                      <Hash className='h-3 w-3 mr-0.5' />
                      {category.slug}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0 shrink-0'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(`/category/${category.slug}`, '_blank')
                        }
                      >
                        <ExternalLink className='mr-2 h-4 w-4' /> Preview Public
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link
                        href={`/dashboard/admin/content/categories/edit/${category.id}`}
                      >
                        <DropdownMenuItem>
                          <Pencil className='mr-2 h-4 w-4' /> Edit Details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className='text-destructive focus:bg-destructive/10 focus:text-destructive'
                        onClick={() => setDeleteId(category.id)}
                      >
                        <Trash2 className='mr-2 h-4 w-4' /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className='p-5 pt-2'>
                <p className='text-sm text-muted-foreground line-clamp-3 min-h-15'>
                  {category.description || 'No description provided.'}
                </p>
              </CardContent>

              <CardFooter className='p-5 pt-0 flex items-center justify-between border-t border-muted/50 mt-2'>
                <div className='flex items-center text-sm font-medium text-foreground/70'>
                  <BookOpen className='h-4 w-4 mr-2 text-primary/70' />
                  {/* {category._count?.articles || 0} Articles */}
                </div>
                <Badge
                  variant='secondary'
                  className='bg-primary/5 text-primary hover:bg-primary/10 border-transparent text-[10px] uppercase tracking-wider'
                >
                  Active
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category. This action cannot be
              undone and may affect associated articles.
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

function CategoryGridSkeleton() {
  return (
    <div className='space-y-8 p-4 md:p-8 max-w-7xl mx-auto'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-11 w-full sm:w-36' />
      </div>
      <Skeleton className='h-11 w-full max-w-md' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className='h-50 w-full rounded-xl' />
        ))}
      </div>
    </div>
  );
}
