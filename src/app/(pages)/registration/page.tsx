"use client";

import Input from "@/components/common/input/Input";
import SigninInput from "@/components/common/input/SignInInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiPolkadot } from "react-icons/si";

export default function Registration() {
  const handleNameChange = () => {
    console.log("name");
  };
  const handleEmailChange = () => {
    console.log("name");
  };
  const handlePasswordChange = () => {
    console.log("name");
  };
  return (
    <div className="mt-28 flex items-center justify-center">
      <div className="grid w-11/12 grid-cols-1 justify-around rounded-2xl shadow-2xl md:grid-cols-5  lg:w-8/12">
        <div className=" col-span-3 bg-secondary p-4 md:rounded-l-2xl">
          <section className="my-8 flex flex-col items-center justify-center gap-4">
            <h1 className=" text-center text-3xl font-bold underline">
              Create New Account
            </h1>
            <span className=" flex h-1 w-20 rounded-full"></span>
            <form className="my-6 flex w-full flex-col gap-5 md:w-2/3 ">
              <SigninInput
                label="Name"
                id="name"
                error=""
                type="text"
                onChange={handleNameChange}
                value=""
              />
              <SigninInput
                label="Email"
                id="email"
                error=""
                type="email"
                onChange={handleEmailChange}
                value=""
              />
              <Input
                label="Password"
                id="password"
                error=""
                type="password"
                onChange={handlePasswordChange}
                value=""
              />
              <Button>Registration</Button>
            </form>
          </section>
          <p className="md:hidden">
            Already have an account?{" "}
            <Link href={"/login"} className="text-xl font-bold">
              Login
            </Link>
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 dark:text-slate-50">
            <Link href={"/policy"}>Privacy Policy</Link>
            <SiPolkadot />
            <Link href={"/terms"}>Terms & Condtions</Link>
          </div>
        </div>
        <div className=" col-span-2 hidden flex-col items-center justify-center  gap-4 bg-gradient-to-b from-primary to-pink-600 p-2 text-center text-white md:flex md:rounded-r-2xl lg:p-16">
          <span className="text-lightgray-100 text-3xl font-bold">
            Hi, There!
          </span>
          <span className="bg-lightgray-100 flex h-1 w-20 rounded-full"></span>
          <span className="text-darkgray-100 my-4">
            Already have an account?
          </span>
          <Link href="/login">
            <Button variant="outline" className="px-10 text-primary">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
