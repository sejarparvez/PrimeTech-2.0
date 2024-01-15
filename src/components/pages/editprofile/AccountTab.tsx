import EditProfileInput from "@/components/common/input/EditProfileInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Form, Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

interface props {
  name: string;
  email: string;
}

export default function AccountTab({ name, email }: props) {
  const [error, setError] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status, update } = useSession();

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = ev.target.files?.[0];
    setError("");

    if (selectedFile) {
      const fileSize = selectedFile.size;
      const maxSize = 500 * 1024;

      if (fileSize > maxSize) {
        setError("File size exceeds 500 KB limit");
        ev.target.value = "";
        return;
      }

      setFiles(ev.target.files);
    }
  };

  async function handleClick(newName: string, newImage?: string) {
    try {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: newName,

          image: newImage || session?.user?.image,
        },
      });

      const updatedSession = await getSession();

      if (updatedSession) {
        update({
          data: updatedSession,
          status: "authenticated",
        });
      }
    } catch (error) {
      console.error("Error updating session:", error);
    }
  }

  console.log("Session:", session);
  return (
    <Formik
      initialValues={{ name, email }}
      validationSchema={Yup.object({
        name: Yup.string()
          .min(5, "Name Must be at least 5 characters")
          .max(20, "Name can not be more than 20 characters")
          .required(),
        email: Yup.string().email("Invalid email address").required(),
      })}
      onSubmit={async (values) => {
        try {
          setIsSubmitting(true);
          toast.loading("Please wait...");

          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("email", values.email);
          if (files) {
            formData.append("image", files[0]);
          }

          const response = await axios.put(
            "/api/editprofile/account",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          toast.dismiss();

          if (response.status === 200) {
            // Update session data
            await handleClick(response.data.name, response.data.image);
            toast.success("Profile updated successfully");
          } else {
            toast.error("An error occurred while updating the profile");
          }
        } catch (error: any) {
          toast.dismiss();
          if (error.response) {
            // Server responded with a status other than 2xx
            if (error.response.status === 413) {
              toast.error("File size exceeds 500 KB limit");
            } else {
              toast.error("An error occurred while updating the profile");
            }
          } else if (error.request) {
            // The request was made, but no response was received
            toast.error("No response received from the server");
          } else {
            // Something happened in setting up the request that triggered an error
            toast.error("An error occurred while sending the request");
          }
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <Form>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&#39;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <EditProfileInput
                id="name"
                defaultValue={name}
                name="name"
                type="text"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <EditProfileInput
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                readOnly
              />
              <p className="text-sm text-muted-foreground">
                Email can not be changed
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleFileChange}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save changes"}
            </Button>
          </CardFooter>
        </Card>
        <ToastContainer position="top-center" theme="dark" />
      </Form>
    </Formik>
  );
}
