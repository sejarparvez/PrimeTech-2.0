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

export default function NewPost() {
  const [content, setContent] = useState("");

  return (
    <div className="mt-28 flex items-center justify-center">
      <Card className="w-10/12">
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
          <Button size="lg">Upload Post</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
