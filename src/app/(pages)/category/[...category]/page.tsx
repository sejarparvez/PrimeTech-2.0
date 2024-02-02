"use client";
import PaginationUi from "@/components/common/pagination/Pagination";
import { FetchCategoryPost } from "@/components/fetch/get/categorypost/FetchCategoryPost";
import Loading from "@/components/helper/Loading";
import { formatedCategory } from "@/components/helper/hook/FormattedCategory";
import RecentPostModel from "@/components/pages/home/RecentPostModel";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import { useParams } from "next/navigation";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

export default function Category() {
  const params = useParams();
  const formattedCategory = formatedCategory(params.category[0]);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = FetchCategoryPost(
    page,
    formattedCategory,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  const postCount = data.totalPostsCount;
  const totalPages = Math.ceil(Number(postCount) / 10);

  return (
    <>
      <div className="item-center mt-4 flex justify-center text-4xl font-bold">
        {formattedCategory}
      </div>

      <>
        <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2">
          {data.posts.map((post: FeaturedPostType) => (
            <RecentPostModel
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

        {totalPages > 1 && (
          <div className="my-20">
            <PaginationUi
              currentPage={page}
              totalPages={totalPages}
              setCurrentPage={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </>
    </>
  );
}
