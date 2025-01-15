"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor"
import { getPost, savePost } from "@/services/post"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(1, {
    message: "Content cannot be empty.",
  }),
})

export default function EditForm() {
  const editorRef = useRef<TiptapEditorRef>(null)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const getWordCount = useCallback(
    () => editorRef.current?.getInstance()?.storage.characterCount.words() ?? 0,
    [editorRef]
  )

  useEffect(() => {
    getPost().then((post) => {
      form.reset(post)
      setIsLoading(false)
    })
  }, [form])

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        savePost({ ...value, wordCount: getWordCount() })
      }
    })
    return () => subscription.unsubscribe()
  }, [form, getWordCount])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // You can handle form submission here if needed
    console.log(values)
  }

  if (isLoading) return null

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}

