"use client";

import SigninInput from "@/components/common/input/SignInInput";
import RegistrationRight from "@/components/pages/authentication/RegistrationRight";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { SiPolkadot } from "react-icons/si";
import * as Yup from "yup";

export default function Registration() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(5, "Name Must be at least 5 characters")
            .max(20, "Name can not be more than 20 characters")
            .required(),
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
          <div className="grid w-11/12 grid-cols-1 justify-around rounded-2xl shadow-2xl md:grid-cols-5 lg:w-8/12">
            <div className="col-span-3 bg-secondary p-4 md:rounded-l-2xl">
              <section className="my-8 flex flex-col items-center justify-center gap-4">
                <h1 className="text-center text-3xl font-bold underline">
                  Create New Account
                </h1>
                <span className="flex h-1 w-20 rounded-full"></span>
                <Form className="my-6 flex w-full flex-col gap-5 md:w-2/3">
                  <SigninInput label="name" name="name" id="name" type="text" />
                  <SigninInput
                    label="email"
                    name="email"
                    id="email"
                    type="email"
                  />
                  <SigninInput
                    label="password"
                    name="password"
                    id="password"
                    type="password"
                  />

                  <Button type="submit" disabled={submitting}>
                    Registration
                  </Button>
                </Form>
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
                <Link href={"/terms"}>Terms & Conditions</Link>
              </div>
            </div>
            <RegistrationRight />
          </div>
        </div>
      </Formik>
    </>
  );
}
