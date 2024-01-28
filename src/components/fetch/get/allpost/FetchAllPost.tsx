import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function FetchAllPost(page: number) {
  return useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/post/allpost?page=${page}&pageSize=10`,
      );
      return response.data;
    },
  });
}
