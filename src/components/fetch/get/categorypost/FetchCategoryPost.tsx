import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function FetchCategoryPost(page: number, category: string) {
  return useQuery({
    queryKey: ["categorypost", page, category],
    queryFn: async () => {
      const response = await axios.get(
        `/api/post/categorypost?category=${category}&page=${page}&pageSize=10`,
      );
      return response.data;
    },
  });
}
