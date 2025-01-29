import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

// Initialize Axios API Client
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Centralized Query Keys
const QUERY_KEYS = {
  SINGLE_ARTICLE: 'Single article',
  DASHBOARD_ARTICLES: 'Dashboard Articles',
  RECENT_ARTICLES: 'Recent Articles',
  FEATURED_ARTICLES: 'Featured Articles',
  ALL_ARTICLES: 'All Articles',
};

// Custom Hook for Debounced Value
const useDebouncedValue = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => setDebouncedValue(value), delay);
    handler();
    return () => handler.cancel();
  }, [value, delay]);

  return debouncedValue;
};

// Fetch Single Article
export const useSinglePost = ({ id }: { id: string }) => {
  const queryFn = async () => {
    const response = await apiClient.get(`/article/single-article`, {
      params: { id },
    });
    return response.data;
  };

  return useQuery({
    queryKey: [QUERY_KEYS.SINGLE_ARTICLE, id],
    queryFn,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Delete Article Mutation
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/article/single-article`, {
        params: { id },
      });
      return response.data;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SINGLE_ARTICLE, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_ARTICLES],
      });
    },
  });
};

// Fetch Dashboard Articles with Debounced Search Query
interface DashboardProps {
  page: number;
  category?: string;
  searchQuery?: string;
}

export const useDashboardArticle = ({
  page,
  category = '',
  searchQuery = '',
}: DashboardProps) => {
  const debouncedSearchQuery = useDebouncedValue(searchQuery);

  const queryFn = async () => {
    const response = await apiClient.get(`/dashboard/all-article`, {
      params: { page, category, searchQuery: debouncedSearchQuery },
    });
    return response.data;
  };

  return useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD_ARTICLES,
      page,
      category,
      debouncedSearchQuery,
    ],
    queryFn,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
};

// Fetch Recent Posts
export const useRecentPosts = () => {
  const queryFn = async () => {
    const response = await apiClient.get(`/article/recent`);
    return response.data;
  };

  return useQuery({
    queryKey: [QUERY_KEYS.RECENT_ARTICLES],
    queryFn,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Fetch Featured Articles
export const useFeaturedArticles = () => {
  const queryFn = async () => {
    const response = await apiClient.get(`/article/featured`);
    return response.data;
  };

  return useQuery({
    queryKey: [QUERY_KEYS.FEATURED_ARTICLES],
    queryFn,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    refetchOnWindowFocus: false,
  });
};
