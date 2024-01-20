import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import img1 from "@/image/img1.jpg";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaComment, FaRegCalendarAlt } from "react-icons/fa";

export default function RecentPostModel() {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-3">
        <div className="relative">
          <Image
            src={img1}
            alt=""
            className="h-full w-full rounded-md object-cover"
          />
          <div className="absolute -bottom-6 left-10 flex items-center justify-center">
            <Image
              src={img1}
              alt=""
              className="z-10 h-12 w-12 rounded-full object-cover ring ring-white"
            />
            <div className="absolute -top-2  h-8 w-16 rounded-t-full bg-primary"></div>
          </div>
          <Link href="/blog/postid">
            <Button
              size="sm"
              className="absolute bottom-1 right-0 flex items-center justify-center gap-3 transition-all duration-300 hover:px-5"
            >
              <span>View Details</span>
              <FaAngleRight />
            </Button>
          </Link>
          <div className=" absolute right-2 top-2" title="comment count">
            <div className="relative">
              <FaComment size="36" />
            </div>
            <p className="absolute left-2 top-1.5 text-sm text-white dark:text-black">
              10
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-5">
          <h1 className="text-2xl font-bold transition-all duration-300 hover:text-primary">
            The New Smashing Mystery Riddle: Have You Figured It Out Yet?
          </h1>
          <p className="flex items-center gap-4 text-gray-600 dark:text-gray-500">
            <FaRegCalendarAlt />
            <span>June 23, 2014</span>
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud...
          </p>
          <div className="flex items-center justify-start">
            <Badge>Featured</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
