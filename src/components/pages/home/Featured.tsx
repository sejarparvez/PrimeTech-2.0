"use client";
import formatDate from "@/components/helper/FormattedDate";
import Loading from "@/components/helper/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaAngleRight, FaComment, FaRegCalendarAlt } from "react-icons/fa";

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
    fetch(`api/post/featured`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "No featured posts found.") {
          setPost(null);
        } else {
          setPost(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  console.log(post);

  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="">
          {post && post.length > 0 ? (
            post.map((postItem) => (
              <CarouselItem key={postItem._id}>
                <Card className="group relative bg-secondary">
                  <CardContent className="relative rounded-md p-4">
                    <Link href="/blog/postid">
                      <Image
                        src={postItem.coverImage}
                        alt=""
                        className="h-52 w-full rounded-lg object-cover brightness-50 transition-all duration-300  group-hover:brightness-90 md:h-[29rem]"
                        width={900}
                        height={900}
                      />
                    </Link>
                  </CardContent>
                  <div className="flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:px-8">
                    <div className="flex gap-16 text-muted-foreground">
                      <span>{postItem.author.name}</span>
                      <span className="flex items-center justify-center gap-2">
                        <FaRegCalendarAlt />
                        <span>{formatDate(postItem.updatedAt)}</span>
                      </span>
                    </div>

                    <Badge className="w-fit">Featured</Badge>
                  </div>
                  <div className="absolute bottom-[5.8rem] left-10 flex items-center justify-center md:bottom-[4rem] md:left-16">
                    <Image
                      src={postItem.author.image}
                      alt=""
                      height={100}
                      width={100}
                      className="z-10 h-10 w-10 rounded-full object-cover ring ring-white md:h-16 md:w-16"
                    />
                    <div className="absolute -top-1.5 h-7 w-[3.1rem]  rounded-t-full bg-primary md:-top-2 md:h-10 md:w-20"></div>
                  </div>
                  <Link href="/blog/postid">
                    <Button className="absolute bottom-28 right-0 flex scale-75 items-center justify-center gap-3 transition-all duration-300 hover:px-10 md:bottom-24 md:right-4 md:scale-100">
                      <span>View Details</span>
                      <FaAngleRight />
                    </Button>
                  </Link>
                  <div
                    className=" absolute right-10 top-10"
                    title="comment count"
                  >
                    <div className="relative">
                      <FaComment size="36" />
                    </div>
                    <p className="absolute left-2 top-1 text-white dark:text-black">
                      {postItem._count.comments}
                    </p>
                  </div>
                  <Link
                    href="/blog/postid"
                    className="absolute bottom-40 left-12 mr-12 text-2xl font-bold text-white md:bottom-48 md:text-5xl"
                  >
                    {postItem.title}
                  </Link>
                </Card>
              </CarouselItem>
            ))
          ) : (
            <Loading />
          )}
        </CarouselContent>
        <CarouselPrevious variant="default" />
        <CarouselNext variant="default" />
      </Carousel>
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
    </div>
  );
}
