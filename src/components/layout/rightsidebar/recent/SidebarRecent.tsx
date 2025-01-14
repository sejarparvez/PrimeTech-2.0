import { FetchRecentPost } from "@/components/fetch/post/FetchPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/interface/post/FeaturedPostType";
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
        <div className="mx-auto mt-5 flex w-11/12 flex-col gap-4 md:w-3/5 lg:w-10/12">
          {data.map((post: FeaturedPostType) => (
            <PostModel
              key={post.id}
              id={post.id}
              image={post.coverImage}
              title={post.title}
            />
          ))}
        </div>
      )}
    </>
  );
}
