"use client";

import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getPost, savePost } from "@/services/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { NewArticleCategoryAndTags } from "./NewArticleCategory";
import { ProductImage } from "./NewArticleImage";
import { NewArticleSchema } from "./NewArticleSchema";

export default function NewArticleForm() {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const getWordCount = useCallback(
    () => editorRef.current?.getInstance()?.storage.characterCount.words() ?? 0,
    [editorRef],
  );

  useEffect(() => {
    getPost().then((post) => {
      form.reset(post);
      setIsLoading(false);
    });
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        savePost({ ...value, wordCount: getWordCount() });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, getWordCount]);

  function onSubmit(values: z.infer<typeof NewArticleSchema>) {
    // You can handle form submission here if needed
    if (!image) {
      setWarning("Please upload an image.");
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append("image", image);
    console.log(formData);
  }

  if (isLoading) return null;

  // Enhanced form reset function
  const resetForm = () => {
    form.reset({
      title: "",
      content: "",
      category: "",
      tags: [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/">
            <Button
              variant="outline"
              type="button"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            New Design
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" type="button" onClick={resetForm}>
              Discard
            </Button>
            <Button size="sm" type="submit">
              Save Design
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      ref={editorRef}
                      ssr={true}
                      output="html"
                      placeholder={{
                        paragraph: "Type your content here...",
                        imageCaption: "Type caption for image (optional)",
                      }}
                      contentMinHeight={256}
                      contentMaxHeight={640}
                      onContentChange={field.onChange}
                      initialContent={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Write the content of your post here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">
            <ProductImage image={image} setImage={setImage} error={warning} />
            <NewArticleCategoryAndTags />
          </div>
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
