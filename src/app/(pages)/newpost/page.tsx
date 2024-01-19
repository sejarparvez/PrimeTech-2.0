"use client";
import { CategorySelect } from "@/components/pages/newpost/CategorySelect";
import PostContent from "@/components/pages/newpost/PostContent";
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
import { useState } from "react";
import { Form, Formik } from "formik";

export default function NewPost() {
  const [content, setContent] = useState("");

  return (
    <Formik
      initialValues={{ title: "", category: "", content: "" }}
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
              <div>
                <Label>Post Title:</Label>
                <Input placeholder="Post Title" type="text" />
              </div>
              <div>
                <Label>Featured Image:</Label>
                <Input placeholder="Featured Image" type="file" />
              </div>
              <div>
                <Label>Select Post Category:</Label>
                <CategorySelect />
              </div>
              <div>
                <Label>Post Content:</Label>
                <PostContent
                  onChange={(newValue) => setContent(newValue)}
                  error=""
                  value={content}
                />
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
