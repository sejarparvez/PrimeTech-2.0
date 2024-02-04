"use client";
import { FetchSinglePost } from "@/components/fetch/get/singlepost/FetchSinglePost";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

export default function NewPost() {
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const router = useRouter();

  const MAX_IMAGE_SIZE_KB = 500;

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

  const { data, isLoading, isError } = FetchSinglePost();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading posts. Please try again later.</p>;
  }

  // Function to properly encode a string for URLs
  const encodeForUrl = (str: string) => {
    return encodeURIComponent(str.replace(/\s+/g, "-")).toLowerCase();
  };

  const encodeDate = (date: string) => {
    const postDate = new Date(date);

    // Extract date components
    const day = ("0" + postDate.getDate()).slice(-2);
    const month = ("0" + (postDate.getMonth() + 1)).slice(-2);
    const year = postDate.getFullYear();

    const formattedDateStr = `${day}/${month}/${year}`;
    return formattedDateStr;
  };

  return (
    <>
      <Formik
        initialValues={{
          title: data.title,
          category: data.category,
          content: data.content,
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .matches(
              /^[a-zA-Z0-9\s,'_]+$/,
              "Title can not contain special characters",
            )
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
          formData.append("id", data.id);
          formData.append("userId", data.authorId);
          if (image) {
            formData.append("image", image as Blob);
          }

          try {
            setIsSubmitting(true);
            toast.loading("Please wait...");
            const response = await axios.put("/api/post/editpost", formData);

            if (response.status === 200) {
              toast.dismiss();

              toast.success("Post uploaded successfully!");
              const uri = response.data.title;
              const category = response.data.category;
              const encodedUri = uri ? encodeForUrl(uri) : "";
              const encodedCategory = category ? encodeForUrl(category) : "";
              const date = response.data.createdAt;
              const formattedDate = encodeDate(date);

              setTimeout(() => {
                setIsSubmitting(false);
                router.push(
                  `/article/${encodedCategory}/${formattedDate}/${encodedUri}`,
                );
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
                <CardTitle className="text-3xl">Update Post</CardTitle>
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
                  <FileInput onFileSelect={handleFile} isRequired={false} />
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
                  Update Post
                </Button>
              </CardFooter>
            </Card>
          </div>
          <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        </Form>
      </Formik>
    </>
  );
}
