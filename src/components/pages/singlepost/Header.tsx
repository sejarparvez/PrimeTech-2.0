import img from "@/image/img1.jpg";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="rounded-lg border  md:mb-10 md:p-4  ">
        <h1 className="mb-4 text-xl font-extrabold text-primary md:text-2xl lg:text-4xl">
          Micron to invest $3.6B in Japan for next-gen memory chips
        </h1>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <span className="flex text-sm">
              <span className="text-sm ">
                This Post Last Was Updated By{" "}
                <Link href={`/users/`}>
                  <span className="px-1 text-lg font-medium text-primary">
                    sejarparvez
                  </span>{" "}
                </Link>
                At <span className=" font-medium">22nd December 2023</span>
              </span>
            </span>
          </div>
          <div>
            <Link href={`/category/`}>
              {" "}
              <button className="dark:text-primary-200 mr-10 rounded-br-2xl rounded-tl-2xl bg-primary px-4 py-1 font-bold text-white">
                Featured
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Image
        src={img}
        alt=""
        className="h-52 w-full rounded-lg object-cover  md:h-[29rem]"
        width={900}
        height={900}
      />
    </>
  );
}
