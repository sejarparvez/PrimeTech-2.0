"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Loading from "@/components/helper/Loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be 6 characters long")
    .max(15, "Password can not be more than 15 characters"),
});

export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.replace("/profile");
    }
  }, [session, router]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setSubmitting(true);
      toast.loading("Please wait...");
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      toast.dismiss();
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Successful sign-in");
        setTimeout(() => {
          router.back();
        }, 2000);
        return;
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {status === "authenticated" || status === "loading" ? (
        <Loading />
      ) : (
        <div className="mt-28 flex items-center justify-center">
          <div className="grid w-11/12 grid-cols-1 justify-around rounded-2xl border  md:w-10/12 md:grid-cols-5 lg:w-8/12">
            <div className="col-span-3 md:rounded-l-2xl">
              <section className="my-8 flex flex-col items-center justify-center gap-4">
                <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
                  Log in to PrimeTech
                </h1>
                <span className="bg-primary-200 flex h-1 w-20 rounded-full"></span>
                <div className="my-3 flex gap-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary dark:border-white dark:text-white">
                    <FaFacebookF />
                  </span>{" "}
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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-10/12 space-y-3 lg:w-8/12"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Button
                        type="submit"
                        className="mt-4 w-full"
                        disabled={submitting}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </section>
            </div>
            <div className="col-span-2 hidden flex-col items-center justify-center gap-4 bg-secondary p-3 text-center md:flex  md:rounded-r-2xl lg:p-16">
              <span className="text-lightgray-100 text-3xl font-bold">
                Hi, There!
              </span>
              <span className="flex h-1 w-20 rounded-full"></span>
              <span className="my-4">
                New to PrimeTech? Let&#39;s create a free account to start your
                journey with us.
              </span>
              <Link href="/registration">
                <Button>Registration</Button>
              </Link>
            </div>
          </div>
          <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        </div>
      )}
    </>
  );
}
