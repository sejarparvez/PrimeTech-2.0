"use client";
import PasswordInput from "@/components/common/input/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Form, Formik } from "formik";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function PasswordTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status, update } = useSession();
  return (
    <Formik
      initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
      validationSchema={Yup.object({
        oldPassword: Yup.string()
          .min(6, "Password must be 6 characters long")
          .max(15, "Password can not be more than 15 characters")
          .required("Current password must be provided"),
        newPassword: Yup.string()
          .min(6, "Password must be 6 characters long")
          .max(15, "Password can not be more than 15 characters")
          .required("New Password Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("newPassword")], "Passwords must match")
          .required("Please confirm your password"),
      })}
      onSubmit={async (values) => {
        const oldPassword = values.oldPassword;
        const newPassword = values.newPassword;

        try {
          setIsSubmitting(true);
          toast.loading("Please wait...");

          // Update the user's password
          const response = await axios.put("/api/editprofile/password", {
            oldPassword,
            newPassword,
          });

          toast.dismiss();
          toast.success(response.data);

          // Logout the user from the current session
          await signOut({ callbackUrl: "/login" });

          // Show a toast notification for successful logout
          toast.info("Logged out from all devices");
        } catch (error: any) {
          toast.dismiss();
          toast.error(error.response?.data || "An error occurred");
          console.error("An error occurred while making the API call:", error);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <Form>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&#39;ll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <PasswordInput id="current" name="oldPassword" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <PasswordInput id="new" name="newPassword" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm New password</Label>
              <PasswordInput id="confirm" name="confirmPassword" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              Save password
            </Button>
          </CardFooter>
        </Card>
        <ToastContainer position="top-center" theme="dark" />
      </Form>
    </Formik>
  );
}
