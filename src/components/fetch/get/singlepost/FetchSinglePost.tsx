import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface props {
  id: string;
}

export function FetchSinglePost({ id }: props) {
  return useQuery({
    queryKey: ["Single Design", id],
    queryFn: async () => {
      const response = await axios.get(`/api/post/singlepost?id=${id}`);
      return response.data;
    },
  });
}
