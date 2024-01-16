"use client";
import PasswordInput from "@/components/common/input/PasswordInput";
import SigninInput from "@/components/common/input/SignInInput";
import Loading from "@/components/helper/Loading";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.replace("/profile");
    }
  }, [session, router]);

  return (
    <>
      {status === "authenticated" || status === "loading" ? (
        <Loading />
      ) : (
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
            try {
              setSubmitting(true);
              toast.loading("Please wait...");
              const response = await signIn("credentials", {
                ...values,
                redirect: false,
              });
              toast.dismiss();
              if (response?.error) {
                toast.error(response.error);
                console.log(response);
              } else {
                toast.success("Successful sign-in");

                setTimeout(() => {
                  router.back();
                }, 2000);
              }
            } catch (error) {
              toast.dismiss();
              toast.error("Sign in failed");
              console.log(error);
            }
            setSubmitting(false);
          }}
        >
          <div className="mt-28 flex items-center justify-center">
            <div className="grid w-full grid-cols-1 justify-around rounded-2xl border md:w-10/12  md:grid-cols-5 lg:w-8/12">
              <div className="col-span-3 md:rounded-l-2xl">
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
                      type="email"
                      id="email"
                      placeholder="Email"
                      name="email"
                    />
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="Password"
                    />

                    <Link
                      href="/reset"
                      className="flex justify-end text-sm font-bold text-primary"
                    >
                      Forget Password
                    </Link>

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
              <div className="col-span-2 hidden flex-col items-center justify-center gap-4 bg-secondary p-3 text-center md:flex  md:rounded-r-2xl lg:p-16">
                <span className="text-lightgray-100 text-3xl font-bold">
                  Hi, There!
                </span>
                <span className="flex h-1 w-20 rounded-full"></span>
                <span className="my-4">
                  New to PrimeTech? Let&#39;s create a free account to start
                  your journey with us.
                </span>
                <Link href="/registration">
                  <Button>Registration</Button>
                </Link>
              </div>
            </div>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              theme="dark"
            />
          </div>
        </Formik>
      )}
    </>
  );
}
