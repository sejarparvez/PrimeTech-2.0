'use client';
import { articleCategories } from '@/app/constants/articleCategory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { NewArticleSchema, NewArticleSchemaType } from '@/lib/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ChevronLeft, Upload, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { CgAsterisk } from 'react-icons/cg';
import { toast } from 'react-toastify';
import * as z from 'zod';
import TiptapEditor, {
  TiptapEditorRef,
} from './TiptapEditor/components/Editor';

export default function NewDesign() {
  const { status } = useSession();
  const router = useRouter();

  // Handle loading and unauthenticated states
  if (status === 'loading') return <ArticleSkeleton />;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <>
      <div className="md:mx-2">
        <NewArticleForm />
      </div>
    </>
  );
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" /> {/* Back button */}
          <Skeleton className="h-8 w-32" /> {/* Title */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" /> {/* Discard button */}
          <Skeleton className="h-9 w-28" /> {/* Save button */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          {/* Article Title */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Editor Toolbar */}
          <Skeleton className="h-10 w-full" />

          {/* Content Area */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>

          {/* Word Count */}
          <Skeleton className="mt-4 h-4 w-40" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" /> {/* Label */}
            <Skeleton className="h-[200px] w-full rounded-lg" />{' '}
            {/* Image placeholder */}
            <Skeleton className="h-4 w-48" /> {/* Help text */}
          </div>

          {/* Category Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Select */}
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" /> {/* Label */}
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" /> {/* Input */}
              <Skeleton className="h-10 w-16" /> {/* Add button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewArticleForm() {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [image, setImage] = useState<File | null>(null);
  const [warning, setWarning] = useState<string>('');

  const form = useForm<z.infer<typeof NewArticleSchema>>({
    resolver: zodResolver(NewArticleSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      tags: [],
    },
  });

  const resetForm = () => {
    form.reset({ title: '', content: '', category: '', tags: [] });
    setImage(null);
    setWarning('');
  };

  async function onSubmit(data: NewArticleSchemaType) {
    if (!image) {
      setWarning('Please upload an image.');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append('image', image);

    toast.loading('Uploading, please wait...');
    try {
      const response = await axios.post(
        '/api/dashboard/single-article',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      toast.dismiss();
      if (response.status === 201) {
        toast.success('Article successfully added');
        resetForm();
      } else {
        toast.error('Failed to add article');
      }
    } catch {
      toast.dismiss();
      toast.error('Failed to add article');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/">
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
                        paragraph: 'Type your content here...',
                        imageCaption: 'Type caption for image (optional)',
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
            <ArticleImage image={image} setImage={setImage} error={warning} />
            <NewArticleCategoryAndTags />
          </div>
        </div>
      </form>
    </Form>
  );
}

interface ArticleImageProps {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  error?: string;
}

const MAX_IMAGE_SIZE_KB = 900;

function ArticleImage({ image, setImage, error }: ArticleImageProps) {
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
        setImageError(
          `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`
        );
        toast.error(
          `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`
        );
      } else {
        setImage(file);
        setImageError(null);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          Cover Image
          <CgAsterisk className="h-3 w-3 text-destructive" aria-hidden="true" />
        </CardTitle>
        <CardDescription>
          Upload an image. Maximum file size is {MAX_IMAGE_SIZE_KB} KB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {image ? (
            <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-md">
              <Image
                src={URL.createObjectURL(image)}
                alt="Product image"
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ) : (
            <div className="h-48 w-full max-w-sm">
              <Label
                htmlFor="image-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground bg-muted"
              >
                <Upload
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="mt-2 text-sm text-muted-foreground">
                  Click to upload
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          )}
          {(imageError || error) && (
            <p className="text-sm text-destructive" role="alert">
              {imageError || error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <FormLabel className="flex items-center gap-1">
    {children}
    <CgAsterisk className="h-3 w-3 text-destructive" aria-hidden="true" />
  </FormLabel>
);

const NewArticleCategoryAndTags: React.FC = () => {
  const { control, setValue, watch } = useFormContext<NewArticleSchemaType>();
  const tags = watch('tags') || [];

  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim(); // Trim whitespace from the input
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const currentTags = watch('tags') || [];
      setValue('tags', [...currentTags, trimmedTag]); // Set the new tags array directly
      setInput(''); // Clear the input field after adding the tag
    } else if (!trimmedTag) {
      console.warn('Cannot add an empty tag.'); // Optional: Add a warning for empty tags
    }
  };

  const removeTag = (indexToRemove: number) => {
    setValue(
      'tags',
      tags.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Category and Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <RequiredLabel>Article Category</RequiredLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articleCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormLabel>Tags</FormLabel>
            <div className="mb-2 flex flex-wrap gap-2">
              {tags
                .filter((tag) => tag.trim() !== '') // Filter out empty string tags
                .map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2 py-1 text-sm"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="ml-1 h-auto p-0"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </Button>
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
                onClick={() => addTag(input)}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
