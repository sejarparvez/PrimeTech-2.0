import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '../constants/QeeryKeys';

// Fetch Single Article
export const useUserProfile = ({ id }: { id: string }) => {
  const queryFn = async () => {
    const response = await axios.get(`/api/dashboard/profile`, {
      params: { id },
    });
    return response.data;
  };

  return useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE, id],
    queryFn,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useEditProfile = () => {
  const queryFn = async () => {
    const response = await axios.get(`/api/dashboard/edit-profile`);
    return response.data;
  };

  return useQuery({
    queryKey: [QUERY_KEYS.EDIT_PROFILE],
    queryFn,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
