"use client";
import SigninInput from "@/components/common/input/SignInInput";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function Login() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required(),
          password: Yup.string()
            .min(6, "Password must be 6 characters long")
            .max(15, "Password can not be more than 15 characters")
            .required(),
        })}
        onSubmit={async (values) => {
          setSubmitting(true);
          console.log(values);
        }}
      >
        <div className="mt-28 flex items-center justify-center">
          <div className="grid w-full grid-cols-1 justify-around rounded-2xl shadow-2xl md:w-10/12 md:grid-cols-5  lg:w-8/12">
            <div className="col-span-3 bg-secondary  md:rounded-l-2xl">
              <section className="my-8 flex flex-col items-center justify-center gap-4">
                <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
                  Log in to PrimeTech
                </h1>
                <span className="bg-primary-200 flex h-1 w-20 rounded-full"></span>
                <div className="my-3 flex gap-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                    <FaFacebookF />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                    <FaTwitter />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                    <FaGithub />
                  </span>
                </div>
                <p className="dark:text-primary-200">
                  or use your email account
                </p>
                <Form className="my-6 flex w-11/12 flex-col gap-5 md:w-2/3">
                  <SigninInput
                    label="Input Your Email"
                    id="email"
                    type="email"
                    name="email"
                  />
                  <SigninInput
                    label="Input Your Password"
                    id="password"
                    type="password"
                    name="password"
                  />
                  <Button type="submit" disabled={submitting}>
                    Log In
                  </Button>
                  <p className="text-center md:hidden">
                    Don&apos;t have an account?
                    <Link href={"/signup"} className="pl-2 text-xl font-bold">
                      Register
                    </Link>
                  </p>
                </Form>
              </section>
            </div>
            <div className="col-span-2 hidden flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary to-pink-600 p-3 text-center text-white md:flex  md:rounded-r-2xl lg:p-16">
              <span className="text-lightgray-100 text-3xl font-bold">
                Hi, There!
              </span>
              <span className="bg-lightgray-100 flex h-1 w-20 rounded-full"></span>
              <span className="text-darkgray-100 my-4">
                New to PrimeTech? Let&#39;s create a free account to start your
                journey with us.
              </span>
              <Link href="/registration">
                <Button variant="outline" className="text-primary shadow-lg">
                  Registration
                </Button>
              </Link>
            </div>
          </div>
          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </Formik>
    </>
  );
}
