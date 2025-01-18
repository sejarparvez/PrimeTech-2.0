import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from "date-fns";
import Image from "next/image";
import { LuCalendarDays } from "react-icons/lu";

interface PostHeaderProps {
  title: string;
  cover: string;
  authorName: string;
  createdAt: string;
  category: string;
  authorImage: string;
}

const PostHeader = ({
  title,
  authorImage,
  cover,
  createdAt,
  authorName,
  category,
}: PostHeaderProps) => {
  const formattedDate = formatDistanceToNow(parseISO(createdAt), {
    addSuffix: true,
  });
  return (
    <div className="mx-auto lg:max-w-[45rem]">
      <h1 className="text-3xl font-bold leading-snug md:text-4xl md:leading-normal">
        {title}
      </h1>

      <div className="mt-6 flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={authorImage} alt={authorName} />
          <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="">
          <div className="mb-3 font-semibold">
            By <u>{authorName}</u>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-sm">
              <LuCalendarDays size={18} />
              <span>{formattedDate}</span>
            </div>
            <div className="mx-3 h-1.5 w-1.5 rounded-full bg-gray-500 dark:bg-gray-300"></div>
            <Badge>{category}</Badge>
          </div>
        </div>
      </div>

      <Image
        src={cover}
        alt={title}
        width={1932}
        height={1087}
        className="my-10 rounded-lg"
        priority
      />
    </div>
  );
};

export default PostHeader;
