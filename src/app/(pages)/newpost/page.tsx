"use client";
import { CategorySelect } from "@/components/pages/newpost/CategorySelect";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

export default function NewPost() {
  return (
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
      onSubmit={async (values) => {
        console.log(values);
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
                <Input placeholder="Featured Image" type="file" />
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
              <Button size="lg" type="submit">
                Upload Post
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Form>
    </Formik>
  );
}
