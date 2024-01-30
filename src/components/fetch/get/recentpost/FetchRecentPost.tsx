import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function FetchRecentPost() {
  return useQuery({
    queryKey: ["recentpost"],
    queryFn: async () => {
      const response = await axios.get(`/api/post/recentpost`);
      return response.data;
    },
  });
}
