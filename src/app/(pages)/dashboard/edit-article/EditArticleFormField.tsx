'use client';

import TiptapEditor, {
  type TiptapEditorRef,
} from '@/app/(pages)/dashboard/new-article/TiptapEditor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { articleCategories } from '@/app/constants/articleCategory';
import { useSinglePost } from '@/app/services/article';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { CgAsterisk } from 'react-icons/cg';
import { toast } from 'react-toastify';
import {
  EditArticleSchema,
  EditArticleSchemaType,
} from '../new-article/NewArticleSchema';
import EditArtilceImage from './EditArticleImage';

export default function EditArticleForm({ id }: { id: string }) {
  const { isLoading, data, isError, refetch } = useSinglePost({ id });
  const editorRef = useRef<TiptapEditorRef>(null);
  const [input, setInput] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [deletedImage, setDeletedImage] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditArticleSchemaType>({
    resolver: zodResolver(EditArticleSchema),
    defaultValues: {
      id: '',
      title: '',
      content: '',
      category: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
      });
      setInitialImage(data.coverImage || '');
      setImageId(data.imageId);
    }
  }, [data, form]);

  const resetForm = () => {
    if (data) {
      form.reset({
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
      });
      setInitialImage(data.coverImage || '');
      setNewImage(null);
      setDeletedImage(null);
    }
  };

  const handleAddNewImage = (file: File) => {
    setNewImage(file);
    setDeletedImage(null);
  };

  const handleDeleteImage = () => {
    setDeletedImage(initialImage);
    setNewImage(null);
  };

  const { control, setValue } = form;
  const tags: string[] = useWatch({ control, name: 'tags', defaultValue: [] });

  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (
        trimmedTag &&
        !tags.some((t) => t.toLowerCase() === trimmedTag.toLowerCase())
      ) {
        setValue('tags', [...tags, trimmedTag]);
        setInput('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [tags, setValue]
  );

  const removeTag = useCallback(
    (indexToRemove: number) => {
      setValue(
        'tags',
        tags.filter((_, index) => index !== indexToRemove)
      );
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [tags, setValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(input);
      } else if (e.key === 'Backspace' && !input && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    },
    [input, tags, addTag, removeTag]
  );

  async function onSubmit(data: EditArticleSchemaType) {
    const formData = new FormData();

    // Append form data
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'tags') {
        (value as string[]).forEach((tag) => formData.append('tags', tag));
      } else {
        formData.append(key, value.toString());
      }
    });

    // Append image files
    if (newImage) {
      formData.append('image', newImage);
      formData.append('deletedImage', imageId || '');
    }
    toast.loading('Please wait..');

    try {
      // Make the API request using Axios
      const response = await axios.put(
        '/api/dashboard/single-article',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
        }
      );

      // Display success notification
      toast.dismiss();
      toast.success('Article updated successfully!');
      refetch();
    } catch (error) {
      toast.dismiss();
      // Display error notification
      toast.error('Failed to update article. Please try again.');
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading article. Please try again later.</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/all-article?category=all&query=&page=1">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">Edit Article</h1>
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
                        paragraph: 'Type your content here...',
                        imageCaption: 'Type caption for image (optional)',
                      }}
                      contentMinHeight={400}
                      contentMaxHeight={640}
                      onContentChange={field.onChange}
                      initialContent={field.value || data?.content || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <EditArtilceImage
              image={initialImage}
              deletedImage={deletedImage}
              handleAddNewImage={handleAddNewImage}
              handleDeleteImage={handleDeleteImage}
            />

            <Card>
              <CardHeader>
                <CardTitle>Category & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <>
                  <FormField
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex">
                          <span>Category</span>
                          <CgAsterisk color="red" />
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={data.category || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {articleCategories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a tag..."
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => input && addTag(input)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
