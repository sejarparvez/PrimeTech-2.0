import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

export function FetchSinglePost() {
  const params = useParams();

  const category = params.category;

  const createdAt = `${params.slug[2]}-${params.slug[1].padStart(2, "0")}-${
    params.slug[0]
  }`;
  return useQuery({
    queryKey: ["singlePost", category, createdAt, params.slug[3]],
    queryFn: async () => {
      const response = await axios.get(
        `/api/post/singlepost?category=${category}&createdAt=${createdAt}&title=${params.slug[3]}`,
      );
      return response.data;
    },
  });
}
