"use client";
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
import img1 from "@/image/img1.jpg";
import img2 from "@/image/img2.jpg";
import img3 from "@/image/img3.jpg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaAngleRight, FaComment, FaRegCalendarAlt } from "react-icons/fa";

export default function Featured() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const data = [
    { id: 1, name: "this is the name", img: img1 },
    { id: 2, name: "this is the name", img: img2 },
    { id: 3, name: "this is the name", img: img3 },
  ];
  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="">
          {data.map((data) => (
            <CarouselItem key={data.id}>
              <Card className="group relative bg-secondary">
                <CardContent className="relative rounded-md p-4">
                  <Link href="/blog/postid">
                    <Image
                      src={data.img}
                      alt=""
                      className="h-[29rem] w-full rounded-lg object-cover brightness-50 transition-all  duration-300 group-hover:brightness-90"
                    />
                  </Link>
                </CardContent>
                <div className="flex items-center justify-between px-8 py-6">
                  <div className="flex gap-16 text-muted-foreground">
                    <span>SEJAR PARVEZ</span>
                    <span className="flex items-center justify-center gap-2">
                      <FaRegCalendarAlt />
                      <span>19th Dec 2023</span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Badge>Featured</Badge>
                    <Badge>Marketing</Badge>
                  </div>
                </div>
                <div className="absolute bottom-[3.5rem] left-16 flex items-center justify-center">
                  <Image
                    src={img1}
                    alt=""
                    className="z-10 h-16 w-16 rounded-full object-cover ring ring-white"
                  />
                  <div className="absolute -top-2  h-10 w-20 rounded-t-full bg-primary"></div>
                </div>
                <Link href="/blog/postid">
                  <Button className="absolute bottom-24 right-4 flex items-center justify-center gap-3 transition-all duration-300 hover:px-10">
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
                    10
                  </p>
                </div>
                <Link
                  href="/blog/postid"
                  className="absolute bottom-48 left-12 mr-12 text-5xl font-bold text-white"
                >
                  Leaner Responsive Images With Client Hints
                </Link>
              </Card>
            </CarouselItem>
          ))}
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
