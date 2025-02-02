'use client';

import { useDeleteArticle } from '@/app/services/article';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { articleInterFace } from '@/utils/interface';
import { createSlug } from '@/utils/slug';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Edit, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { DeleteArticleDialog } from './DeleteArticleDialog';

export function ArticleCard({
  article,
  refetch,
}: {
  article: articleInterFace;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use the delete article mutation
  const deleteArticleMutation = useDeleteArticle();

  // Function to handle article deletion
  const handleDelete = async () => {
    toast.loading('Please wait...');
    try {
      // Call the delete mutation with the article id
      await deleteArticleMutation.mutateAsync(article.id);
      toast.dismiss();
      toast.success('Article deleted successfully!');
      refetch();
      setIsDeleteDialogOpen(false); // Close the delete dialog
    } catch (error) {
      toast.dismiss();
      console.error('Error deleting article:', error);
      toast.error('An error occurred while deleting the article.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-700/25">
        <div className="relative aspect-[16/10]">
          <Image
            src={article.coverImage || '/placeholder.svg'}
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
                <Link
                  href={createSlug({ id: article.id, name: article.title })}
                >
                  <Button size="icon" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/dashboard/edit-article?id=${article.id}`}>
                  <Button size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="mb-1 line-clamp-2 text-base text-white sm:text-lg">
              <Link href={createSlug({ id: article.id, name: article.title })}>
                {article.title}
              </Link>
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
          <Link href={createSlug({ id: article.id, name: article.title })}>
            <Button size="sm" variant="secondary">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
          <Link href={`/dashboard/edit-article?id=${article.id}`}>
            <Button size="sm" variant="secondary">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardContent>
      </Card>
      <DeleteArticleDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        articleTitle={article.title}
      />
    </motion.div>
  );
}
