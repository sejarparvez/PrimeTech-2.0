import { FetchRecentPost } from "@/components/fetch/get/recentpost/FetchRecentPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import { v4 as uuidv4 } from "uuid";
import PostModel from "./PostModel";

export default function SidebarRecent() {
  const { data, isLoading, isError } = FetchRecentPost();

  return (
    <>
      {isLoading ? (
        <div className="m-3">
          <Loading />
        </div>
      ) : isError ? (
        <p>Error loading posts. Please try again later.</p>
      ) : (
        <div className="mx-auto mt-5  flex w-11/12 flex-col gap-4 md:w-3/5 lg:w-10/12">
          {data.map((post: FeaturedPostType) => (
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
      )}
    </>
  );
}
