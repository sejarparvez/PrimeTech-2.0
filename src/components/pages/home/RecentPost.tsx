"use client";
import { FetchAllPost } from "@/components/fetch/get/allpost/FetchAllPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import { v4 as uuidv4 } from "uuid";
import RecentPostModel from "./RecentPostModel";

export default function RecentPost() {
  const { data, isLoading, isError } = FetchAllPost();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  return (
    <div className="my-20 grid grid-cols-1 gap-12 md:grid-cols-2">
      {data.posts.map((post: FeaturedPostType) => (
        <RecentPostModel
          key={uuidv4()}
          title={post.title}
          image={post.coverImage}
          time={post.updatedAt}
          authorImage={post.author.image}
          name={post.author.name}
          comments={post._count.comments}
          category={post.category}
        />
      ))}
    </div>
  );
}
