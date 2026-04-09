'use client';
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
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
import { articleCategories } from '@/constants/articleCategory';
import { useSession } from '@/lib/auth-client';
import { NewArticleSchema, type NewArticleSchemaType } from '@/lib/Schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ChevronLeft, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useRef, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import TiptapEditor, {
  type TiptapEditorRef,
} from './TiptapEditor/components/Editor';

export default function NewDesign() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) return <ArticleSkeleton />;
  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className='md:mx-2'>
      <NewArticleForm />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArticleSkeleton
// ---------------------------------------------------------------------------

function ArticleSkeleton() {
  return (
    <div className='min-h-screen p-4 md:p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-6 w-6' />
          <Skeleton className='h-8 w-32' />
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-9 w-28' />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-10 w-full' />
          </div>
          <Skeleton className='h-10 w-full' />
          <div className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-[90%]' />
            <Skeleton className='h-4 w-[95%]' />
            <Skeleton className='h-4 w-[85%]' />
          </div>
          <Skeleton className='mt-4 h-4 w-40' />
        </div>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-50 w-full rounded-lg' />
            <Skeleton className='h-4 w-48' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-16' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 flex-1' />
              <Skeleton className='h-10 w-16' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NewArticleForm
// ---------------------------------------------------------------------------

function NewArticleForm() {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageWarning, setImageWarning] = useState('');

  const methods = useForm<z.infer<typeof NewArticleSchema>>({
    resolver: zodResolver(NewArticleSchema),
    defaultValues: { title: '', content: '', category: '', tags: [] },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const resetForm = () => {
    reset({ title: '', content: '', category: '', tags: [] });
    setImage(null);
    setImageWarning('');
  };

  async function onSubmit(data: NewArticleSchemaType) {
    if (!image) {
      setImageWarning('Please upload an image.');
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
        { headers: { 'Content-Type': 'multipart/form-data' } },
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* Header */}
        <div className='flex flex-wrap items-center gap-4'>
          <Link href='/dashboard/'>
            <Button
              variant='outline'
              type='button'
              size='icon'
              className='h-9 w-9'
            >
              <ChevronLeft className='h-5 w-5' />
              <span className='sr-only'>Back</span>
            </Button>
          </Link>
          <h1 className='text-lg font-semibold sm:text-xl'>New Article</h1>
          <div className='ml-auto flex gap-2'>
            <Button variant='outline' type='button' onClick={resetForm}>
              Discard
            </Button>
            <Button type='submit'>Save Article</Button>
          </div>
        </div>

        {/* Body */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-12'>
          {/* Main column */}
          <div className='space-y-6 md:col-span-2 lg:col-span-8'>
            {/* Title */}
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor='article-title'>Article Title</FieldLabel>
                  <Input
                    id='article-title'
                    placeholder='Enter post title...'
                    {...field}
                  />
                  {errors.title && (
                    <FieldError>{errors.title.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Content */}
            <Controller
              control={control}
              name='content'
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor='article-content'>
                    Article Content
                  </FieldLabel>
                  <TiptapEditor
                    ref={editorRef}
                    ssr
                    output='html'
                    placeholder={{
                      paragraph: 'Type your content here...',
                      imageCaption: 'Type caption for image (optional)',
                    }}
                    contentMinHeight={400}
                    contentMaxHeight={640}
                    onContentChange={field.onChange}
                    initialContent={field.value}
                  />
                  {errors.content && (
                    <FieldError>{errors.content.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Sidebar */}
          <div className='space-y-6 lg:col-span-4'>
            <ArticleImage
              image={image}
              setImage={setImage}
              error={imageWarning}
            />
            <NewArticleCategoryAndTags />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

// ---------------------------------------------------------------------------
// ArticleImage
// ---------------------------------------------------------------------------

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
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_KB * 1024) {
      const msg = `Image size exceeds the maximum limit of ${MAX_IMAGE_SIZE_KB} KB`;
      setImageError(msg);
      toast.error(msg);
    } else {
      setImage(file);
      setImageError(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageError(null);
  };

  const errorMessage = imageError || error;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-1'>
          Cover Image
          <span className='text-destructive text-xs' aria-hidden='true'>
            *
          </span>
        </CardTitle>
        <CardDescription>
          Upload an image. Maximum file size is {MAX_IMAGE_SIZE_KB} KB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          {image ? (
            <div className='relative h-48 w-full max-w-sm overflow-hidden rounded-md'>
              <Image
                src={URL.createObjectURL(image)}
                alt='Cover image preview'
                fill
                className='object-cover'
              />
              <Button
                variant='destructive'
                size='icon'
                type='button'
                className='absolute right-2 top-2'
                onClick={removeImage}
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Remove image</span>
              </Button>
            </div>
          ) : (
            <div className='h-48 w-full max-w-sm'>
              <Label
                htmlFor='image-upload'
                className='flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground bg-muted'
              >
                <Upload
                  className='h-8 w-8 text-muted-foreground'
                  aria-hidden='true'
                />
                <span className='mt-2 text-sm text-muted-foreground'>
                  Click to upload
                </span>
                <Input
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  className='sr-only'
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          )}
          {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Field>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// NewArticleCategoryAndTags
// ---------------------------------------------------------------------------

const NewArticleCategoryAndTags: React.FC = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewArticleSchemaType>();

  const tags = watch('tags') ?? [];
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue('tags', [...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setValue(
      'tags',
      tags.filter((_, i) => i !== indexToRemove),
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
        <FieldSet>
          <FieldGroup>
            {/* Category */}
            <Controller
              control={control}
              name='category'
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor='article-category'>
                    Article Category
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='article-category'>
                      <SelectValue placeholder='Select Category' />
                    </SelectTrigger>
                    <SelectContent>
                      {articleCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <FieldError>{errors.category.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Tags */}
            <Field>
              <FieldLabel htmlFor='tag-input'>Tags</FieldLabel>
              <FieldDescription>
                Press Enter or click Add to insert a tag. Backspace removes the
                last one.
              </FieldDescription>
              {tags.filter((t) => t.trim()).length > 0 && (
                <div className='mb-2 flex flex-wrap gap-2'>
                  {tags
                    .filter((tag) => tag.trim() !== '')
                    .map((tag, index) => (
                      <Badge
                        // biome-ignore lint/suspicious/noArrayIndexKey: stable tag list
                        key={index}
                        variant='secondary'
                        className='px-2 py-1 text-sm'
                      >
                        {tag}
                        <Button
                          variant='ghost'
                          size='sm'
                          type='button'
                          className='ml-1 h-auto p-0'
                          onClick={() => removeTag(index)}
                        >
                          <X className='h-3 w-3' />
                          <span className='sr-only'>Remove {tag} tag</span>
                        </Button>
                      </Badge>
                    ))}
                </div>
              )}
              <div className='flex gap-2'>
                <Input
                  id='tag-input'
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Add a tag...'
                  className='grow'
                />
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => addTag(input)}
                >
                  Add
                </Button>
              </div>
              {errors.tags && <FieldError>{errors.tags.message}</FieldError>}
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
};
