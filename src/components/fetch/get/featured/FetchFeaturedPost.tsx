import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function FetchFeaturedPosts() {
  return useQuery({
    queryKey: ["featuredPosts"],
    queryFn: async () => {
      const response = await axios.get("api/post/featured");
      return response.data;
    },
  });
}
