import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetch Single Article

export const useSinglePost = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["Single article", id],
    queryFn: async () => {
      const response = await axios.get(`/api/article/single-article?id=${id}`);
      return response.data;
    },
  });
};

import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

interface Props {
  page: number;
  category: string;
  searchQuery: string;
}

export const useDashboardArticle = ({ page, category, searchQuery }: Props) => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearchQuery(searchQuery), 300);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  return useQuery({
    queryKey: ["All Designs", page, category, debouncedSearchQuery],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/all-article", {
        params: { page, category, searchQuery: debouncedSearchQuery },
      });
      return response.data;
    },
  });
};

export const useRecentPosts = () => {
  return useQuery({
    queryKey: ["Recent Posts"],
    queryFn: async () => {
      const response = await axios.get("/api/article/recent");
      return response.data;
    },
  });
};

// Fetch Featured articles

export const useFeaturedArticles = () => {
  return useQuery({
    queryKey: ["Featured Articles"],
    queryFn: async () => {
      const response = await axios.get("/api/article/featured");
      return response.data;
    },
  });
};
