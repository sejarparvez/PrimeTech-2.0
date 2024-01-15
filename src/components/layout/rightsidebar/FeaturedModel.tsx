import img1 from "@/image/img1.jpg";
import Image from "next/image";

export default function FeaturedModel() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Image
          src={img1}
          alt=""
          className="h-48 w-full rounded-lg object-cover lg:h-32"
        />
      </div>
      <div className="flex flex-col gap-1 ">
        <div className="font-semibold text-primary">Featured</div>
        <div className="font-bold">
          Combining Design And Ps ych ology To Change Behavior
        </div>
        <div className="text-gray-600">July 7, 2019</div>
      </div>
    </div>
  );
}
