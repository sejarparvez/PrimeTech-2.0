'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  CheckCircle,
  ChevronLeft,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import slugify from 'slugify';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import type * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
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
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/lib/auth-client';
import { NewArticleSchema, type NewArticleSchemaType } from '@/lib/Schemas';
import { useSlugCheck } from '@/services/article';
import { useCategories } from '@/services/categories';
import TiptapEditor, {
  type TiptapEditorRef,
} from '@/tiptap-editor/components/editor';

/**
 * Slug Utility
 */
const slugifyText = (text: string) => {
  return slugify(text, { lower: true, strict: true });
};

export default function NewArticlePage() {
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

function NewArticleForm() {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const methods = useForm<z.infer<typeof NewArticleSchema>>({
    resolver: zodResolver(NewArticleSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      category: '',
      tags: [],
      isFeatured: false,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const currentTitle = watch('title');
  const currentSlug = watch('slug');
  const [debouncedSlug] = useDebounce(currentSlug, 500);

  const { data: slugCheckData, isFetching: isCheckingSlug } =
    useSlugCheck(debouncedSlug);

  useEffect(() => {
    if (!isSlugCustomized && currentTitle) {
      setValue('slug', slugifyText(currentTitle), { shouldValidate: true });
    }
  }, [currentTitle, isSlugCustomized, setValue]);

  const resetForm = () => {
    reset();
    setImage(null);
    setIsSlugCustomized(false);
  };

  async function onSubmit(data: NewArticleSchemaType) {
    if (!image) {
      toast.error('Please upload a cover image.');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    formData.append('image', image);

    toast.loading('Saving article...');
    try {
      const response = await axios.post(
        '/api/dashboard/single-article',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      toast.dismiss();
      if (response.status === 201) {
        toast.success('Article published successfully');
        resetForm();
      }
    } catch (_err) {
      toast.dismiss();
      toast.error('Failed to save article');
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='container mx-auto space-y-8 px-4 py-6'
      >
        {/* Header Section */}
        <div className='flex flex-wrap items-center gap-4 border-b pb-6'>
          <Link href='/dashboard/'>
            <Button variant='outline' type='button' size='icon'>
              <ChevronLeft className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Create New Article
            </h1>
            <p className='text-sm text-muted-foreground'>
              Fill in the details to publish your next masterpiece.
            </p>
          </div>
          <div className='ml-auto flex gap-3'>
            <Button variant='ghost' type='button' onClick={resetForm}>
              Discard
            </Button>
            <Button type='submit' className='px-8'>
              Publish Article
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* Main Content Area */}
          <div className='space-y-6 lg:col-span-8'>
            {/* Title */}
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <Field>
                  <FieldLabel className='text-lg'>Title</FieldLabel>
                  <Input
                    className='text-lg py-6'
                    placeholder='Enter a catchy title...'
                    {...field}
                  />
                  {errors.title && (
                    <FieldError>{errors.title.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Slug */}
            <Controller
              control={control}
              name='slug'
              render={({ field }) => (
                <Field>
                  <FieldLabel>URL Slug</FieldLabel>
                  <div className='relative'>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setIsSlugCustomized(true);
                        field.onChange(e);
                      }}
                      className='pr-24'
                    />
                    {isSlugCustomized && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs gap-1'
                        onClick={() => {
                          setIsSlugCustomized(false);
                          setValue('slug', slugifyText(currentTitle));
                        }}
                      >
                        <RefreshCw className='h-3 w-3' /> Reset
                      </Button>
                    )}
                  </div>
                  {isSlugCustomized && currentSlug && (
                    <div className='mt-1.5 flex items-center gap-1.5 text-xs'>
                      {isCheckingSlug ? (
                        <span className='flex items-center gap-1 text-muted-foreground'>
                          <Loader2 className='h-3 w-3 animate-spin' />{' '}
                          Checking...
                        </span>
                      ) : slugCheckData?.available ? (
                        <span className='flex items-center gap-1 text-green-600'>
                          <CheckCircle className='h-3 w-3' /> URL is available
                        </span>
                      ) : (
                        <FieldError>URL is already taken</FieldError>
                      )}
                    </div>
                  )}
                  {errors.slug && (
                    <FieldError>{errors.slug.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Editor */}
            <Controller
              control={control}
              name='content'
              render={({ field }) => (
                <Field>
                  <FieldLabel>Content</FieldLabel>
                  <TiptapEditor
                    ref={editorRef}
                    onChange={field.onChange}
                    content={field.value}
                    output='html'
                  />
                  {errors.content && (
                    <FieldError>{errors.content.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Sidebar Area */}
          <div className='space-y-6 lg:col-span-4'>
            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* isFeatured Switch */}
                <Controller
                  control={control}
                  name='isFeatured'
                  render={({ field }) => (
                    <div className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <Label>Featured Article</Label>
                        <p className='text-xs text-muted-foreground'>
                          Show this on the homepage hero section.
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                {/* Dynamic Category Select */}
                <Controller
                  control={control}
                  name='category'
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              categoriesLoading
                                ? 'Loading categories...'
                                : 'Select a category'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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
              </CardContent>
            </Card>

            <ArticleImage image={image} setImage={setImage} />
            <TagInputSection />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

// ---------------------------------------------------------------------------
// Sidebar Components
// ---------------------------------------------------------------------------

function TagInputSection() {
  const { setValue, watch } = useFormContext<NewArticleSchemaType>();
  const [input, setInput] = useState('');
  const tags = watch('tags') || [];

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      setValue('tags', [...tags, val]);
      setInput('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2 mb-3'>
          {tags.map((tag, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
            <Badge key={i} variant='secondary'>
              {tag}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() =>
                  setValue(
                    'tags',
                    tags.filter((_, idx) => idx !== i),
                  )
                }
              />
            </Badge>
          ))}
        </div>
        <div className='flex gap-2'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder='Press enter to add...'
          />
          <Button type='button' variant='outline' onClick={addTag}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ArticleImage({
  image,
  setImage,
}: {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
      </CardHeader>
      <CardContent>
        {image ? (
          <div className='relative aspect-video w-full overflow-hidden rounded-md border'>
            <Image
              src={URL.createObjectURL(image)}
              alt='Preview'
              fill
              className='object-cover'
            />
            <Button
              variant='destructive'
              size='icon'
              className='absolute right-2 top-2'
              onClick={() => setImage(null)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ) : (
          <Label
            htmlFor='image-upload'
            className='flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground bg-muted hover:bg-muted/80'
          >
            <Upload className='h-8 w-8 text-muted-foreground' />
            <span className='mt-2 text-sm'>Click to upload</span>
            <Input
              id='image-upload'
              type='file'
              accept='image/*'
              className='sr-only'
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Label>
        )}
      </CardContent>
    </Card>
  );
}

function ArticleSkeleton() {
  return (
    <div className='p-10 space-y-4'>
      <Skeleton className='h-12 w-1/3' />
      <Skeleton className='h-96 w-full' />
    </div>
  );
}
