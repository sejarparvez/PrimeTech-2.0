import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function FetchAllPost() {

  return useQuery({
    queryKey: ["allPosts"],
    queryFn: async () => {
      const response = await axios.get("/api/post/allpost");
      return response.data;
    },
  });
}
