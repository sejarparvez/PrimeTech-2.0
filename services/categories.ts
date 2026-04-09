import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';
import { QUERY_KEYS } from '@/constants/query-keys';
import type { CategoryType } from '@/types/categories';

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
});

const updateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
});

type CreateCategoryInput = z.infer<typeof createCategorySchema>;
type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: CreateCategoryInput) => {
      const { data } = await axios.post('/api/admin/categories/add', formData);
      return data;
    },
    onSuccess: () => {
      toast.success('Category created successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to create category');
    },
  });
}

export function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const { data } = await axios.get('/api/categories');
      return data;
    },
  });
}

export function useSingleCategory(id: string) {
  return useQuery<CategoryType>({
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/categories/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: UpdateCategoryInput;
    }) => {
      const { data } = await axios.put(`/api/admin/categories/${id}`, formData);
      return data;
    },
    onSuccess: () => {
      toast.success('Category updated successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to update category');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/admin/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Category deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to delete category');
    },
  });
}
