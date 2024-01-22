"use client";
import Loading from "@/components/helper/Loading";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";
import { useEffect, useState } from "react";
import FeaturedCard from "./FeaturedCard";

// Import statements...

interface Post {
  _id: string;
  coverImage: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  _count: {
    comments: number;
  };
  updatedAt: string;
}

export default function Featured() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [post, setPost] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // New state for error handling

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

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("api/post/featured")
      .then((response) => {
        setPost(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading posts:", error);

        if (error.response && error.response.status === 404) {
          // No featured posts found
          setError("No featured posts found.");
        } else {
          // Other errors
          setError("Error loading posts. Please try again later.");
        }

        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading && <Loading />} {/* Display loading state */}
      {error && (
        <div className="font-bold text-red-500">
          {error} {/* Display error message */}
        </div>
      )}
      {!isLoading && !error && (
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent className="">
            {post && post.length > 0 ? (
              post.map((postItem) => (
                <CarouselItem key={postItem._id}>
                  <FeaturedCard
                    title={postItem.title}
                    time={postItem.updatedAt}
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
      {!isLoading && !error && (
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
