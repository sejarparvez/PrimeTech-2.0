"use client";
import Loading from "@/components/helper/Loading";
import { CategorySelect } from "@/components/pages/newpost/CategorySelect";
import { FileInput } from "@/components/pages/newpost/FileInput";
import PostContent from "@/components/pages/newpost/PostContent";
import PostInput from "@/components/pages/newpost/PostInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function NewPost() {
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const MAX_IMAGE_SIZE_KB = 500;

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  const handleFile = (file: File) => {
    if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
      setImageError("file size exceeds the maximum allowed size");
      toast.error(
        `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`,
      );
    } else {
      setImage(file);
      setImageError("");
    }
  };

  return (
    <>
      {status === "unauthenticated" || status === "loading" ? (
        <Loading />
      ) : (
        <Formik
          initialValues={{ title: "", category: "", content: "" }}
          validationSchema={Yup.object({
            title: Yup.string()
              .min(20, "Title Must be at least 20 characters")
              .max(80, "Title can not be more than 80 characters")
              .required(),
            category: Yup.string().required(),
            content: Yup.string().required(),
          })}
          onSubmit={async (values: {
            title: string;
            category: string;
            content: string;
          }) => {
            if (imageError) {
              toast.error(imageError);
              return;
            }

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("category", values.category);
            formData.append("content", values.content);
            formData.append("image", image as Blob);

            try {
              setIsSubmitting(true);
              toast.loading("Please wait...");
              const response = await axios.post("/api/post/newpost", formData);

              if (response.status === 201) {
                toast.dismiss();
                toast.success("Post uploaded successfully!");
                setTimeout(() => {
                  setIsSubmitting(false);
                  router.push("/profile");
                }, 2000);
              } else {
                toast.dismiss();
                setIsSubmitting(false);
                toast.error("Error uploading post");
              }
            } catch (error) {
              setIsSubmitting(false);
              toast.dismiss();
              toast.error("Error uploading post: ");
            }
          }}
        >
          <Form>
            <div className="mt-28 flex items-center justify-center">
              <Card className="mx-1 w-full md:w-10/12 lg:w-9/12">
                <CardHeader className="flex items-center justify-center">
                  <CardTitle className="text-3xl">Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <PostInput
                    name="title"
                    id="title"
                    label="Post Title:"
                    placeholder="Post Title"
                    type="text"
                  />
                  <div>
                    <Label>Featured Image:</Label>
                    <FileInput onFileSelect={handleFile} />
                    {imageError && (
                      <p className="text-sm text-red-600">{imageError}</p>
                    )}
                  </div>
                  <div>
                    <Label>Select Post Category:</Label>
                    <Field as={CategorySelect} name="category" />
                  </div>
                  <div>
                    <Label>Post Content:</Label>
                    <PostContent />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="lg" type="submit" disabled={isSubmitting}>
                    Upload Post
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <ToastContainer position="top-center" autoClose={3000} />
          </Form>
        </Formik>
      )}
    </>
  );
}
