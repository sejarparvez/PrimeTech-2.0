"use client";

import PasswordInput from "@/components/common/input/PasswordInput";
import SigninInput from "@/components/common/input/SignInInput";
import Loading from "@/components/helper/Loading";
import RegistrationRight from "@/components/pages/authentication/RegistrationRight";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiPolkadot } from "react-icons/si";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function Registration() {
  const [submitting, setSubmitting] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [userId, setUserId] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      {status === "authenticated" || status === "loading" ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{ name: "", email: "", password: "", code: "" }}
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
            code: showPopUp
              ? Yup.string().required("Verification code is required")
              : Yup.string(),
          })}
          onSubmit={async (values) => {
            setSubmitting(true);

            try {
              if (showPopUp) {
                const response = await toast.promise(
                  axios.put("/api/registration", {
                    userId,
                    code: values.code,
                  }),
                  {
                    pending: "Verifying the code",
                    success: "Code verified successfully 👍",
                    error: "Invalid code. Please try again 🤯",
                  },
                );

                if (response.status === 200) {
                  setTimeout(() => {
                    router.push("/login");
                  }, 1000);
                }
              } else {
                const response = await toast
                  .promise(axios.post("/api/registration", values), {
                    pending: "Sending the verification code",
                    success: "Email sent successfully 👌",
                  })

                  .catch((error) => {
                    toast.error(error.response.data);
                  });

                if (response && response.status === 200) {
                  setUserId(response.data.userId);
                  setShowPopUp(true);
                  setReadOnly(true);
                }
              }
            } catch (error) {
              console.error("Error during registration/verification:", error);
            }

            setSubmitting(false);
          }}
        >
          <div className="mt-28 flex items-center justify-center">
            <div className="grid w-11/12 grid-cols-1 justify-around rounded-2xl border md:grid-cols-5 lg:w-8/12">
              <div className="col-span-3 p-4 md:rounded-l-2xl">
                <section className="my-8 flex flex-col items-center justify-center gap-4">
                  <h1 className="text-center text-3xl font-bold underline">
                    Create New Account
                  </h1>
                  <span className="flex h-1 w-20 rounded-full"></span>
                  <Form className="my-6 flex w-full flex-col gap-5 md:w-2/3">
                    <SigninInput
                      placeholder="Name"
                      name="name"
                      id="name"
                      type="text"
                      readOnly={readOnly}
                    />
                    <SigninInput
                      name="email"
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      readOnly={readOnly}
                    />

                    <PasswordInput
                      placeholder="Password"
                      name="password"
                      id="password"
                      readOnly={readOnly}
                    />

                    {showPopUp && (
                      <div>
                        <SigninInput
                          placeholder="Verification Code"
                          name="code"
                          id="code"
                          type="number"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Check your email for the verification code. Make sure
                          to check your spam folder as well.
                        </p>
                      </div>
                    )}

                    <Button type="submit" disabled={submitting}>
                      Registration
                    </Button>
                  </Form>
                </section>
                <p className="md:hidden">
                  Already have an account?
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

            <ToastContainer position="top-center" theme="dark" />
          </div>
        </Formik>
      )}
    </>
  );
}
