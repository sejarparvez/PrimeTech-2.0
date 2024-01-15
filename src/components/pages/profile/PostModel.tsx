import img from "@/image/img3.jpg";
import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function PostModel() {
  return (
    <div className="mx-2 flex gap-2">
      <div className="w-3/12">
        <Image src={img} alt="" className="h-16 w-full rounded object-cover" />
      </div>
      <div className="w-9/12">
        <div className="font-semibold">
          The New Smashing Mystery Riddle: Have You Figured It Out Yet?
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FaRegCalendarAlt />
          <span>June 23, 2014</span>
        </div>
      </div>
    </div>
  );
}
