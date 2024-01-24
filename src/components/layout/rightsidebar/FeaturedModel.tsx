import formatDate from "@/components/helper/hook/FormattedDate";
import { useFormattedPostLink } from "@/components/helper/hook/FormattedLink";
import Image from "next/image";
import Link from "next/link";

interface props {
  image: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

export default function FeaturedModel({
  image,
  title,
  createdAt,
  updatedAt,
  category,
}: props) {
  const { postLink } = useFormattedPostLink(createdAt, title, category);
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Link href={postLink}>
          <Image
            src={image}
            alt=""
            className="h-48 w-full rounded-lg object-cover lg:h-32"
            height={300}
            width={300}
          />
        </Link>
      </div>
      <div className="flex flex-col gap-1 ">
        <div className="font-semibold text-primary">Featured</div>
        <Link href={postLink} className="font-bold">
          {title}
        </Link>
        <div className="text-gray-600">{formatDate(updatedAt)}</div>
      </div>
    </div>
  );
}
