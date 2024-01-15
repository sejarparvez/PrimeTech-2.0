"use client";
import Loading from "@/components/helper/Loading";
import Code from "@/components/pages/reset/Code";
import Email from "@/components/pages/reset/Email";
import Password from "@/components/pages/reset/Password";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function PasswordResetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showEmail, setShowEmail] = useState<boolean>(true);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const getButtonText = () => {
    switch (true) {
      case showEmail:
        return "Send Verification Code";
      case showVerification:
        return "Verify Code";
      case showPasswordReset:
        return "Reset Password";
      default:
        return "Submit";
    }
  };

  async function sendEmail(email: string): Promise<boolean> {
    try {
      await toast.promise(axios.post("/api/reset/email", { email }), {
        pending: "Sending the verification code",
        success: "Email sent successfully 👌",
      });

      return true;
    } catch (error: any) {
      toast.error(error.response.data);
      return false;
    }
  }

  async function verifyCode(code: string, email: string): Promise<boolean> {
    try {
      await toast.promise(axios.put("/api/reset/email", { code, email }), {
        pending: "Matching verification code",
        success: "Code is verified 👌",
      });

      return true;
    } catch (error: any) {
      toast.error(error.response.data);
      return false;
    }
  }

  async function resetPassword(values: {
    email: string;
    code: string;
    password: string;
  }): Promise<boolean> {
    try {
      await toast.promise(axios.put("/api/reset/password", values), {
        pending: "Resetting password",
        success: "Password reset successful 👌",
      });

      return true;
    } catch (error: any) {
      toast.error(error.response.data);
      return false;
    }
  }

  return (
    <>
      {status === "authenticated" || status === "loading" ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{
            email: "",
            code: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            code: showVerification
              ? Yup.string().required("Verification code is required")
              : Yup.string(),
            password: showPasswordReset
              ? Yup.string()
                  .min(6, "Password must be 6 characters long")
                  .max(15, "Password can not be more than 15 characters")
                  .required()
              : Yup.string(),
            confirmPassword: showPasswordReset
              ? Yup.string()
                  .oneOf([Yup.ref("password")], "Passwords did not match")
                  .required("Password confirmation is required")
              : Yup.string(),
          })}
          onSubmit={async (values) => {
            setSubmitting(true);

            if (showEmail) {
              const emailSuccess = await sendEmail(values.email);

              if (emailSuccess) {
                setShowEmail(false);
                setShowVerification(true);
              }
            } else if (showVerification) {
              const isCodeValid = await verifyCode(values.code, values.email);

              if (isCodeValid) {
                setShowVerification(false);
                setShowPasswordReset(true);
              } else {
                console.error("Invalid verification code");
              }
            } else if (showPasswordReset) {
              const passwordResetSuccess = await resetPassword(values);

              if (passwordResetSuccess) {
                router.push("/login");
              } else {
                console.error("Error resetting password");
              }
            }

            setSubmitting(false);
          }}
        >
          <Form className=" mx-2 mt-32 flex items-center justify-center">
            <div className="flex w-96 flex-col rounded-md border p-8 shadow-md">
              <h2 className="mb-6 text-2xl font-bold ">Password Reset</h2>
              {showEmail && <Email />}
              {showVerification && <Code />}
              {showPasswordReset && <Password />}
              <Button type="submit" className="mt-8" disabled={submitting}>
                {getButtonText()}
              </Button>
            </div>
            <ToastContainer
              position="top-center"
              theme="dark"
              autoClose={3000}
            />
          </Form>
        </Formik>
      )}
    </>
  );
}
