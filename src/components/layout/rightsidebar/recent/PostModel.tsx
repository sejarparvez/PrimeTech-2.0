import formatDate from "@/components/helper/hook/FormattedDate";
import Image from "next/image";

interface props {
  image: string;
  title: string;
  category: string;
  updatedAt: string;
}

export default function PostModel({
  image,
  title,
  category,
  updatedAt,
}: props) {
  return (
    <div className="flex items-start gap-2">
      <Image
        src={image}
        alt=""
        className="mt-1.5 h-16 w-20 rounded-md object-cover"
        height={200}
        width={200}
      />

      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold text-primary">{category}</div>
        <div className="font-bold">{title}</div>
        <div className="text-gray-600">{formatDate(updatedAt)}</div>
      </div>
    </div>
  );
}
