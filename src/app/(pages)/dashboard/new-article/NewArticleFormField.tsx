"use client";

import TiptapEditor, {
  type TiptapEditorRef,
} from "@/app/(pages)/dashboard/new-article/TiptapEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { NewArticleCategoryAndTags } from "./NewArticleCategory";
import { ProductImage } from "./NewArticleImage";
import { NewArticleSchema, NewArticleSchemaType } from "./NewArticleSchema";

export default function NewArticleForm() {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [image, setImage] = useState<File | null>(null);
  const [warning, setWarning] = useState<string>("");

  const form = useForm<z.infer<typeof NewArticleSchema>>({
    resolver: zodResolver(NewArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: [],
    },
  });

  const resetForm = () => {
    form.reset({ title: "", content: "", category: "", tags: [] });
    setImage(null);
    setWarning("");
  };

  async function onSubmit(data: NewArticleSchemaType) {
    if (!image) {
      setWarning("Please upload an image.");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append("image", image);

    toast.loading("Uploading, please wait...");
    try {
      const response = await axios.post(
        "/api/dashboard/single-article",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.dismiss();
      if (response.status === 201) {
        toast.success("Article successfully added");
        resetForm();
      } else {
        toast.error("Failed to add article");
      }
    } catch {
      toast.dismiss();
      toast.error("Failed to add article");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin-dashboard/">
            <Button
              variant="outline"
              type="button"
              size="icon"
              className="h-9 w-9"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">New Article</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" type="button" onClick={resetForm}>
              Discard
            </Button>
            <Button type="submit">Save Article</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-12">
          <div className="space-y-6 md:col-span-2 lg:col-span-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Content</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      ref={editorRef}
                      ssr
                      output="html"
                      placeholder={{
                        paragraph: "Type your content here...",
                        imageCaption: "Type caption for image (optional)",
                      }}
                      contentMinHeight={400}
                      contentMaxHeight={640}
                      onContentChange={field.onChange}
                      initialContent={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <ProductImage image={image} setImage={setImage} error={warning} />
            <NewArticleCategoryAndTags />
          </div>
        </div>
      </form>
    </Form>
  );
}
