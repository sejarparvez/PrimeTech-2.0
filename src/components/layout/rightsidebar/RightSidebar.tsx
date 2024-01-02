"use client";
import { useState } from "react";
import { FaClock, FaComments, FaStar, FaTag } from "react-icons/fa";
import CategoryModel from "./CategoryModel";
import CommentsModel from "./CommentsModel";
import FeaturedModel from "./FeaturedModel";
import PostModel from "./PostModel";

export default function RightSidebar() {
  const [active, setActive] = useState(1);

  function handleClick(number: number) {
    setActive(number);
  }

  return (
    <div className="mb-20 mt-4">
      <div className="flex items-center justify-center">
        <div className="flex h-12 w-10/12 items-center justify-between rounded-full bg-secondary text-xl md:w-1/2 lg:w-10/12">
          <div
            onClick={() => handleClick(1)}
            className={`rounded-full px-4 py-3 ${
              active === 1
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            <FaClock />
          </div>

          <div
            onClick={() => handleClick(2)}
            className={`rounded-full px-4 py-3 ${
              active === 2
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            <FaStar />
          </div>

          <div
            onClick={() => handleClick(3)}
            className={`rounded-full px-4 py-3 ${
              active === 3
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            <FaComments />
          </div>

          <div
            onClick={() => handleClick(4)}
            className={`rounded-full px-4 py-3 ${
              active === 4
                ? "bg-primary text-white"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            <FaTag />
          </div>
        </div>
      </div>
      <div>
        {active === 1 && (
          <div className="mx-auto mt-5  flex w-11/12 flex-col gap-4 md:w-3/5 lg:w-10/12">
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
          </div>
        )}
        {active === 2 && (
          <div className="mx-auto mt-5  flex w-11/12 flex-col gap-4 md:w-3/5 lg:w-10/12">
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
          </div>
        )}

        {active === 3 && (
          <div className="mx-auto mt-5  flex w-11/12 flex-col gap-5 md:w-3/5 lg:w-10/12">
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
          </div>
        )}
        {active === 4 && (
          <div className="mx-auto mt-5  w-11/12 md:w-3/5 lg:w-10/12">
            <CategoryModel />
          </div>
        )}

        <div className="relative mt-12 border-t">
          <div className=" absolute -top-4 left-6 bg-background px-2 text-xl font-bold text-gray-600">
            Featured
          </div>
          <div className="mx-auto mt-8  flex w-11/12 flex-col gap-6 md:w-3/5 lg:w-10/12">
            <FeaturedModel />
            <FeaturedModel />
            <FeaturedModel />
          </div>
        </div>
      </div>
    </div>
  );
}
