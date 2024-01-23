import { FetchFeaturedPosts } from "@/components/fetch/get/featured/FetchFeaturedPost";
import formatDate from "@/components/helper/FormattedDate";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import FeaturedModel from "./FeaturedModel";

export default function Featured() {
  const { data, isLoading, isError } = FetchFeaturedPosts();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  console.log(data);
  return (
    <div className="relative mt-12 border-t">
      <div className=" absolute -top-4 left-6 bg-background px-2 text-xl font-bold text-gray-600">
        Featured
      </div>
      <div className="mx-auto mt-8  flex w-11/12 flex-col gap-6 md:w-3/5 lg:w-10/12">
        {data && data.length > 0 ? (
          data.map((postItem: FeaturedPostType) => (
            <FeaturedModel
              key={postItem._id}
              title={postItem.title}
              image={postItem.coverImage}
              time={formatDate(postItem.updatedAt)}
            />
          ))
        ) : (
          <p>No featured posts found.</p>
        )}
      </div>
    </div>
  );
}
