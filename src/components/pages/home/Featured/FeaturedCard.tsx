import formatDate from "@/components/helper/hook/FormattedDate";
import { useFormattedPostLink } from "@/components/helper/hook/FormattedLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaComment, FaRegCalendarAlt } from "react-icons/fa";

interface props {
  image: string;
  name: string;
  createdAt: string;
  authorImage: string;
  title: string;
  category: string;
  updatedAt: string;
  comments: number;
}

export default function FeaturedCard({
  image,
  name,
  createdAt,
  authorImage,
  title,
  category,
  updatedAt,
  comments,
}: props) {
  const { postLink } = useFormattedPostLink(createdAt, title, category);
  return (
    <Card className="group relative bg-secondary">
      <Link href={`/blog/${postLink}`}>
        <Image
          src={image}
          alt=""
          className="h-52 w-full rounded-lg object-cover brightness-50 transition-all duration-700  group-hover:brightness-75 md:h-[29rem]"
          width={900}
          height={900}
        />
      </Link>

      <div className="flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex gap-16 text-muted-foreground">
          <span>{name}</span>
          <span className="flex items-center justify-center gap-2">
            <FaRegCalendarAlt />
            <span>{formatDate(updatedAt)}</span>
          </span>
        </div>

        <Badge className="w-fit">Featured</Badge>
      </div>
      <div className="absolute bottom-[5.8rem] left-10 flex items-center justify-center md:bottom-[4rem] md:left-16">
        <Image
          src={authorImage}
          alt=""
          height={100}
          width={100}
          className="z-10 h-10 w-10 rounded-full object-cover ring ring-white md:h-16 md:w-16"
        />
        <div className="absolute -top-1.5 h-7 w-[3.1rem]  rounded-t-full bg-primary md:-top-2 md:h-10 md:w-20"></div>
      </div>
      <Link href={`/blog/${postLink}`}>
        <Button className="absolute bottom-28 right-0 flex scale-75 items-center justify-center gap-3 transition-all duration-300 hover:px-10 md:bottom-24 md:right-6 md:scale-100">
          <span>View Details</span>
          <FaAngleRight />
        </Button>
      </Link>
      <div className=" absolute right-10 top-10" title="comment count">
        <div className="relative">
          <FaComment size="36" />
        </div>
        <p className="absolute left-3 top-1 text-white dark:text-black">
          {comments}
        </p>
      </div>
      <Link
        href={`/blog/${postLink}`}
        className="absolute bottom-40 left-12 mr-12 text-2xl font-bold text-white md:bottom-48 md:text-5xl"
      >
        {title}
      </Link>
    </Card>
  );
}
