import img2 from "@/image/img3.jpg";
import Image from "next/image";

export default function PostModel() {
  return (
    <div className="flex items-start gap-2">
      <div>
        <Image
          src={img2}
          alt=""
          className="mt-1.5 h-12 w-28 rounded-md object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold text-primary">Featured</div>
        <div className="font-bold">
          Combining Design And Ps ych ology To Change Behavior
        </div>
        <div className="text-gray-600">July 7, 2019</div>
      </div>
    </div>
  );
}
