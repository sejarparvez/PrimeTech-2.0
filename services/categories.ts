import { QUERY_KEYS } from '@/constants/query-keys';
import type { CategoryType } from '@/types/categories';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(''),
});

type CreateCategoryInput = z.infer<typeof createCategorySchema>;

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
      const { data } = await axios.get(`/api/categories`);
      return data;
    },
  });
}
