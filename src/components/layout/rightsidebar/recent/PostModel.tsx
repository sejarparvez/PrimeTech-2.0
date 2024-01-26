import formatDate from "@/components/helper/hook/FormattedDate";
import { useFormattedPostLink } from "@/components/helper/hook/FormattedLink";
import Image from "next/image";
import Link from "next/link";

interface props {
  image: string;
  title: string;
  category: string;
  updatedAt: string;
  createdAt: string;
}

export default function PostModel({
  image,
  title,
  category,
  updatedAt,
  createdAt,
}: props) {
  const { postLink } = useFormattedPostLink(createdAt, title, category);
  const encodeForUrl = (str: string) => {
    return encodeURIComponent(str.replace(/\s+/g, "-")).toLowerCase();
  };
  const encodedCategory = category ? encodeForUrl(category) : "";
  return (
    <div className="flex gap-2">
      <Link href={`/blog/${postLink}`} className="mt-2 w-4/12">
        <Image
          src={image}
          alt=""
          height={200}
          width={200}
          className="h-16 w-full rounded object-cover"
        />
      </Link>

      <div className="flex w-8/12 flex-col gap-1 text-sm">
        <div className="font-semibold text-primary">
          <Link href={`/blog/${encodedCategory}`}>{category}</Link>
        </div>
        <div className="font-bold">
          <Link href={`/blog/${postLink}`}>{title}</Link>
        </div>
        <div className="text-gray-600">{formatDate(updatedAt)}</div>
      </div>
    </div>
  );
}
