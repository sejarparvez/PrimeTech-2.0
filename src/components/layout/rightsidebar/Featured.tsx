import { FetchFeaturedPosts } from "@/components/fetch/get/featured/FetchFeaturedPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import { v4 as uuidv4 } from "uuid";
import FeaturedModel from "./FeaturedModel";

export default function Featured() {
  const { data, isLoading, isError } = FetchFeaturedPosts();

  return (
    <>
      {isLoading ? (
        <div className="m-3">
          <Loading />
        </div>
      ) : isError ? (
        <p>Error loading posts. Please try again later.</p>
      ) : (
        <div className="relative mt-12 border-t">
          <div className=" absolute -top-4 left-6 bg-background px-2 text-xl font-bold text-gray-600">
            Featured
          </div>
          <div className="mx-auto mt-8  flex w-11/12 flex-col gap-6 md:w-3/5 lg:w-10/12">
            {data && data.length > 0 ? (
              data.map((postItem: FeaturedPostType) => (
                <FeaturedModel
                  key={uuidv4()}
                  title={postItem.title}
                  image={postItem.coverImage}
                  createdAt={postItem.createdAt}
                  updatedAt={postItem.updatedAt}
                  category={postItem.category}
                />
              ))
            ) : (
              <p>No featured posts found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
