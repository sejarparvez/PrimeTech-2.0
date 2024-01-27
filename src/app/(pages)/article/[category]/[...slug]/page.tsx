"use client";
import { FetchSinglePost } from "@/components/fetch/get/singlepost/FetchSinglePost";
import Loading from "@/components/helper/Loading";
import Header from "@/components/pages/singlepost/Header";
import MainContent from "@/components/pages/singlepost/MainContent";

export default function Page() {
  const { data, isLoading, isError } = FetchSinglePost();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  return (
    <>
      <Header
        title={data.title}
        image={data.coverImage}
        name={data.author.name}
        updatedAt={data.updatedAt}
        category={data.category}
        createdAt={data.createdAt}
      />
      <MainContent content={data.content} />
    </>
  );
}
