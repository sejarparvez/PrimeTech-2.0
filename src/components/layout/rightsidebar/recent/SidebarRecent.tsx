import { FetchAllPost } from "@/components/fetch/get/allpost/FetchAllPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import { v4 as uuidv4 } from "uuid";
import PostModel from "./PostModel";

export default function SidebarRecent() {
  const { data, isLoading, isError } = FetchAllPost();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  const posts = data?.posts.slice(0, 5) || [];
  return (
    <div className="mx-auto mt-5  flex w-11/12 flex-col gap-4 md:w-3/5 lg:w-10/12">
      {posts.map((post: FeaturedPostType) => (
        <PostModel
          key={uuidv4()}
          image={post.coverImage}
          title={post.title}
          updatedAt={post.updatedAt}
          category={post.category}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}
