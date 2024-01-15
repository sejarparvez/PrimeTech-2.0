import img1 from "@/image/img1.jpg";
import Image from "next/image";

export default function CommentsModel() {
  return (
    <div className="flex items-start gap-2">
      <div>
        <Image
          src={img1}
          alt=""
          className="mt-1.5 h-12 w-28 rounded-md object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div className="text-sm text-gray-600">Alex says</div>
        <div className="font-bold hover:text-primary">
          Combining Design And Ps ych ology To Change Behavior
        </div>
      </div>
    </div>
  );
}
