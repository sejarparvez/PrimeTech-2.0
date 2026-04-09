import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export function useCreateArticle() {
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post('/api/admin/blog', formData);
      return data;
    },
    onSuccess: () => {
      toast.success('Article created successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to create article');
    },
  });
}
