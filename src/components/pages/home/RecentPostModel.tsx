import FormattedLink from "@/components/helper/hook/FormattedLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaComment, FaRegCalendarAlt } from "react-icons/fa";

interface props {
  image: string;
  name: string;
  time: string;
  authorImage: string;
  title: string;
  comments: number;
  category: string;
}

export default function RecentPostModel({
  image,
  name,
  time,
  authorImage,
  title,
  comments,
  category,
}: props) {
  const { postLink } = FormattedLink(time, title);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-3">
        <div className="relative">
          <Link href={postLink}>
            <Image
              src={image}
              alt=""
              className="h-full w-full rounded-md object-cover"
              height={500}
              width={500}
            />
          </Link>
          <div className="absolute -bottom-6 left-10 flex items-center justify-center">
            <Image
              src={authorImage}
              alt=""
              className="z-10 h-12 w-12 rounded-full object-cover ring ring-white"
              height={200}
              width={200}
            />
            <div className="absolute -top-2  h-8 w-16 rounded-t-full bg-primary"></div>
          </div>
          <Link href={postLink}>
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
            <p className="absolute left-3 top-1.5 text-sm text-white dark:text-black">
              {comments}
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-5">
          <Link href={postLink}>
            <h1 className="text-2xl font-bold transition-all duration-300 hover:text-primary">
              {title}
            </h1>
          </Link>
          <p className="flex items-center gap-4 text-gray-600 dark:text-gray-500">
            <FaRegCalendarAlt />
            <span>{time}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud...
          </p>
          <div className="flex items-center justify-start">
            <Badge>{category}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
