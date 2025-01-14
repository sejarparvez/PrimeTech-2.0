"use client";
import PaginationUi from "@/components/common/pagination/Pagination";
import { FetchAllPost } from "@/components/fetch/get/allpost/FetchAllPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/interface/post/FeaturedPostType";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import RecentPostModel from "./RecentPostModel";

export default function RecentPost() {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isError } = FetchAllPost(page);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  const postCount = data.totalPostsCount;

  return (
    <>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {data.posts.map((post: FeaturedPostType) => (
          <RecentPostModel
            id={post.id}
            key={uuidv4()}
            title={post.title}
            image={post.coverImage}
            authorImage={post.author.image}
            updatedAt={post.updatedAt}
            comments={post._count.comments}
            category={post.category}
            createdAt={post.createdAt}
            content={post.content}
          />
        ))}
      </div>
      <div className="my-20">
        <PaginationUi
          currentPage={page}
          totalPages={Math.ceil(Number(postCount) / 10)}
          setCurrentPage={(newPage) => setPage(newPage)}
        />
      </div>
    </>
  );
}
