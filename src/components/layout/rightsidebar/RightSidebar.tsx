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
    <div className="mt-4">
      <div className="flex items-center justify-center">
        <div className="flex h-12 w-10/12 items-center justify-between rounded-full bg-secondary text-xl">
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
          <div className="mx-4 mt-5 flex flex-col gap-4">
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
          </div>
        )}
        {active === 2 && (
          <div className="mx-4 mt-5 flex flex-col gap-4">
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
            <PostModel />
          </div>
        )}

        {active === 3 && (
          <div className="mx-4 mt-5 flex flex-col gap-5">
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
            <CommentsModel />
          </div>
        )}
        {active === 4 && (
          <div className="mt-5 mx-4">
            <CategoryModel />
          </div>
        )}

        <div className="relative mt-12 border-t">
          <div className=" absolute -top-4 left-6 bg-background px-2 text-xl font-bold text-gray-600">
            Featured
          </div>
          <div className="mx-4 mt-8 flex flex-col gap-6">
            <FeaturedModel />
            <FeaturedModel />
            <FeaturedModel />
          </div>
        </div>
      </div>
    </div>
  );
}
