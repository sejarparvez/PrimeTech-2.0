// Custom hook to decode URL parameters
import { useParams } from "next/navigation";

function decodeFromUrl(encodedStr: string) {
  return decodeURIComponent(encodedStr.replace(/_/g, " "));
}

export function useUrlParameters() {
  const params = useParams<{ slug: string[]; category: string }>();
  const category = params.category;
  const postDate = params.slug[0];
  const postMonth = params.slug[1];
  const postYear = params.slug[2];
  const postTitle = params.slug[3];
  const decodedTitle = decodeFromUrl(postTitle);

  return {
    category,
    postDate,
    postMonth,
    postYear,
    decodedTitle,
  };
}
