import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function FetchRecentPost() {
  return useQuery({
    queryKey: ["Recent Post"],
    queryFn: async () => {
      const response = await axios.get(`/api/post/recent-post`);
      return response.data;
    },
  });
}
