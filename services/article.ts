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
  search?: string;
  tag?: string;
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

export interface AdminArticleType {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export interface FetchAdminArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

export interface AdminArticleResponse {
  data: AdminArticleType[];
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
  search,
  tag,
}: FetchArticlesParams = {}) {
  return useQuery<ArticleResponse>({
    queryKey: [
      QUERY_KEYS.ARTICLES,
      { category, isFeatured, page, limit, search, tag },
    ],
    queryFn: async () => {
      const { data } = await axios.get('/api/article/recent', {
        params: {
          category,
          featured: isFeatured, // maps to the 'featured' param in API
          page,
          limit,
          search,
          tag,
        },
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fire-and-forget view counter for a single article.
 * Returns the updated view count.
 */
export async function incrementArticleView(slug: string): Promise<number> {
  const { data } = await axios.post(`/api/article/single-article/${slug}`, {
    action: 'view',
  });
  return data.views ?? 0;
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

export interface ArticleCommentType {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
}

/**
 * Hook to fetch comments for a single article by slug
 */
export function useArticleComments(slug: string) {
  return useQuery<{ data: ArticleCommentType[] }>({
    queryKey: [QUERY_KEYS.ARTICLES, slug, 'comments'],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/article/single-article/${slug}/comments`,
      );
      return data;
    },
    enabled: !!slug,
  });
}

/**
 * Hook to post a comment on an article (signed-in users)
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      content,
    }: {
      slug: string;
      content: string;
    }) => {
      const { data } = await axios.post(
        `/api/article/single-article/${slug}/comments`,
        { content },
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success('Comment posted!');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLES, variables.slug, 'comments'],
      });
      // Refresh the article itself so the comment count updates
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLES, variables.slug],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export interface AuthorType {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  _count: {
    Articles: number;
  };
}

export interface AuthorDetailType extends AuthorType {
  articles: ArticleListType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Hook to fetch all authors with published articles
 */
export function useAuthors() {
  return useQuery<{ data: AuthorType[] }>({
    queryKey: [QUERY_KEYS.ARTICLES, 'authors'],
    queryFn: async () => {
      const { data } = await axios.get('/api/authors');
      return data;
    },
  });
}

/**
 * Hook to fetch a single author with their published articles
 */
export function useAuthor(id: string, page = 1, limit = 24) {
  return useQuery<{ data: AuthorDetailType }>({
    queryKey: [QUERY_KEYS.ARTICLES, 'authors', id, { page, limit }],
    queryFn: async () => {
      const { data } = await axios.get(`/api/authors/${id}`, {
        params: { page, limit },
      });
      return data;
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
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
      const { data } = await axios.delete(`/api/admin/articles?id=${id}`);
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

/**
 * Hook to fetch all articles for admin (including drafts and archived)
 */
export function useAdminArticles({
  page = 1,
  limit = 10,
  search = '',
  status,
  category,
}: FetchAdminArticlesParams = {}) {
  return useQuery<AdminArticleResponse>({
    queryKey: [
      QUERY_KEYS.ARTICLES,
      'admin',
      { page, limit, search, status, category },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (category) params.append('category', category);

      const { data } = await axios.get(
        `/api/admin/articles?${params.toString()}`,
      );
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to delete an article as admin
 */
export function useAdminDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/admin/articles?id=${id}`);
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

/**
 * Hook to check if a slug is available
 */
export function useSlugCheck(slug: string, excludeId?: string) {
  return useQuery({
    queryKey: ['slug-check', slug, excludeId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('slug', slug);
      if (excludeId) params.append('excludeId', excludeId);
      const { data } = await axios.get(
        `/api/article/check-slug?${params.toString()}`,
      );
      return data;
    },
    enabled: !!slug && slug.length >= 3,
  });
}
