import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegistrationRight() {
  return (
    <div className=" col-span-2 hidden flex-col items-center justify-center  gap-4 bg-gradient-to-b from-primary to-pink-600 p-2 text-center text-white md:flex md:rounded-r-2xl lg:p-16">
      <span className="text-lightgray-100 text-3xl font-bold">Hi, There!</span>
      <span className="bg-lightgray-100 flex h-1 w-20 rounded-full"></span>
      <span className="text-darkgray-100 my-4">Already have an account?</span>
      <Link href="/login">
        <Button variant="outline" className="px-10 text-primary">
          Log In
        </Button>
      </Link>
    </div>
  );
}
