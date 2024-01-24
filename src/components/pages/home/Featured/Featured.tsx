"use client";
import { FetchFeaturedPosts } from "@/components/fetch/get/featured/FetchFeaturedPost";
import Loading from "@/components/helper/Loading";
import FeaturedPostType from "@/components/type/post/FeaturedPostType";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FeaturedCard from "./FeaturedCard";

export default function Featured() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { data, isLoading, isError } = FetchFeaturedPosts();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  return (
    <div>
      {isLoading && <Loading />}
      {isError && <div className="font-bold text-red-500">{isError}</div>}
      {!isLoading && !isError && (
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent className="">
            {data && data.length > 0 ? (
              data.map((postItem: FeaturedPostType) => (
                <CarouselItem key={uuidv4()}>
                  <FeaturedCard
                    title={postItem.title}
                    createdAt={postItem.createdAt}
                    updatedAt={postItem.updatedAt}
                    category={postItem.category}
                    name={postItem.author.name}
                    authorImage={postItem.author.image}
                    comments={postItem._count.comments}
                    image={postItem.coverImage}
                  />
                </CarouselItem>
              ))
            ) : (
              <p>No featured posts found.</p>
            )}
          </CarouselContent>
          <CarouselPrevious variant="default" />
          <CarouselNext variant="default" />
        </Carousel>
      )}
      {!isLoading && !isError && (
        <div className="mt-4 flex justify-center space-x-4">
          {[...Array(count)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-3 w-3 rounded-full  ${
                index === current - 1 ? "ring-4 ring-primary" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
