import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { ArticleListType } from '@/types/article';

// --- Types ---

export interface FetchArticlesParams {
  category?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface ArticleResponse {
  data: ArticleListType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Helper to extract error messages
const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.message;
  }
  return 'An unexpected error occurred';
};

// --- Hooks ---

/**
 * Hook to fetch a paginated list of articles.
 * Always sorted by updatedAt in descending order (via API).
 */
export function useArticles({
  category,
  isFeatured,
  page = 1,
  limit = 10,
}: FetchArticlesParams = {}) {
  return useQuery<ArticleResponse>({
    queryKey: [QUERY_KEYS.ARTICLES, { category, isFeatured, page, limit }],
    queryFn: async () => {
      const { data } = await axios.get('/api/article/recent', {
        params: {
          category,
          featured: isFeatured, // maps to the 'featured' param in API
          page,
          limit,
        },
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single article by its ID or Slug
 */
export function useSingleArticle(Slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLES, Slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/article/single-article/${Slug}`);
      return data;
    },
    enabled: !!Slug,
  });
}

/**
 * Hook to create a new article (Admin only)
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post('/api/admin/articles', formData);
      return data;
    },
    onSuccess: () => {
      toast.success('Article created successfully!');
      // Invalidate all article queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLES] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Hook to delete an article (Admin only)
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/admin/articles/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Article deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTICLES] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
