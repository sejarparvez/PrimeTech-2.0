"use client";
import { useState } from "react";
import { FaClock, FaComments, FaStar, FaTag } from "react-icons/fa";

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
        {active === 1 && "Recent Post"}
        {active === 2 && "Top Post"}
        {active === 3 && "Comments"}
        {active === 4 && "category"}
      </div>
    </div>
  );
}
