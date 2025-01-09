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
import FeaturedCard from "./FeaturedCard";

export default function Featured() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      console.log("current");
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const { data, isLoading, isError } = FetchFeaturedPosts();

  return (
    <>
      {isLoading ? (
        <div className="mb-10">
          <Loading />
        </div>
      ) : isError ? (
        <p>Error loading posts. Please try again later.</p>
      ) : (
        <div className="mb-10">
          <Carousel setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
              {data && data.length > 0
                ? data.map((postItem: FeaturedPostType) => (
                    <CarouselItem key={postItem.id}>
                      <FeaturedCard
                        title={postItem.title}
                        id={postItem.id}
                        updatedAt={postItem.updatedAt}
                        category={postItem.category}
                        name={postItem.author.name}
                        authorImage={postItem.author.image}
                        comments={postItem._count.comments}
                        image={postItem.coverImage}
                      />
                    </CarouselItem>
                  ))
                : "No content"}
            </CarouselContent>
            <CarouselPrevious variant="default" />
            <CarouselNext variant="default" />
          </Carousel>

          <div className="mt-4 flex justify-center space-x-4">
            {[...Array(count)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-3 w-3 rounded-full ${
                  index === current - 1 ? "ring-4 ring-primary" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
