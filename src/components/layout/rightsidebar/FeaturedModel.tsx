import Image from "next/image";

interface props {
  image: string;
  title: string;
  time: string;
}

export default function FeaturedModel({ image, title, time }: props) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Image
          src={image}
          alt=""
          className="h-48 w-full rounded-lg object-cover lg:h-32"
          height={300}
          width={300}
        />
      </div>
      <div className="flex flex-col gap-1 ">
        <div className="font-semibold text-primary">Featured</div>
        <div className="font-bold">{title}</div>
        <div className="text-gray-600">{time}</div>
      </div>
    </div>
  );
}
