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
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { EditArticleSchema, type EditArticleSchemaType } from '@/lib/Schemas';
import { useSingleArticle, useSlugCheck } from '@/services/article';
import { useCategories } from '@/services/categories';
import TiptapEditor, {
  type TiptapEditorRef,
} from '../../write-article/TiptapEditor/components/Editor';

const slugifyText = (text: string) => {
  return slugify(text, { lower: true, strict: true });
};

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [articleSlug, setArticleSlug] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setArticleSlug(p.slug);
    });
  }, [params]);

  if (isPending) return <ArticleSkeleton />;
  if (!session) {
    router.push('/login');
    return null;
  }

  if (!articleSlug) return <ArticleSkeleton />;

  return (
    <div className='md:mx-2'>
      <EditArticleForm articleSlug={articleSlug} />
    </div>
  );
}

interface EditArticleFormProps {
  articleSlug: string;
}

function EditArticleForm({ articleSlug }: EditArticleFormProps) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [deletedImageId, setDeletedImageId] = useState<string | null>(null);
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formInitialized, setFormInitialized] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: article, isPending, isError } = useSingleArticle(articleSlug);

  const methods = useForm<z.infer<typeof EditArticleSchema>>({
    resolver: zodResolver(EditArticleSchema),
    defaultValues: {
      id: '',
      title: '',
      slug: '',
      content: '',
      category: '',
      tags: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = methods;
  const currentTitle = watch('title');
  const currentSlug = watch('slug');
  const [debouncedSlug] = useDebounce(currentSlug, 500);

  const { data: slugCheckData, isFetching: isCheckingSlug } = useSlugCheck(
    debouncedSlug,
    article?.id,
  );

  useEffect(() => {
    if (article && categories && !formInitialized) {
      setFormInitialized(true);
      setExistingImage(article.coverImage || null);
      setIsFeatured(article.isFeatured || false);
      setSelectedCategory(article.category?.id || '');

      const categoryId = article.category?.id || '';
      const tags = article.tags || [];

      setTimeout(() => {
        setValue('id', article.id);
        setValue('title', article.title || '');
        setValue('slug', article.slug || '');
        setValue('content', article.content || '');
        setValue('category', categoryId);
        setValue('tags', tags);

        if (editorRef.current) {
          const editor = editorRef.current.getInstance();
          if (editor) {
            editor.commands.setContent(article.content || '');
          }
        }
        setEditorReady(true);
      }, 50);
    }
  }, [article, categories, formInitialized, setValue]);

  useEffect(() => {
    if (!isSlugCustomized && currentTitle && editorReady) return;
    if (!isSlugCustomized && currentTitle && article?.title !== currentTitle) {
      setValue('slug', slugifyText(currentTitle), { shouldValidate: true });
    }
  }, [currentTitle, isSlugCustomized, setValue, article?.title, editorReady]);

  const handleRemoveImage = useCallback(() => {
    if (article?.imageId) {
      setDeletedImageId(article.imageId);
    }
    setExistingImage(null);
    setImage(null);
  }, [article?.imageId]);

  const resetForm = () => {
    if (article) {
      reset({
        id: article.id,
        title: article.title || '',
        slug: article.slug || '',
        content: article.content || '',
        category: article.category?.id || '',
        tags: article.tags || [],
      });
      setExistingImage(article.coverImage || null);
      setDeletedImageId(null);
      setImage(null);
      setIsSlugCustomized(false);
      setIsFeatured(article.isFeatured || false);
      setSelectedCategory(article.category?.id || '');

      if (editorRef.current) {
        const editor = editorRef.current.getInstance();
        if (editor) {
          editor.commands.setContent(article.content || '');
        }
      }
    }
  };

  async function onSubmit(data: EditArticleSchemaType) {
    if (!existingImage && !image) {
      toast.error('Please upload a cover image.');
      return;
    }

    const formData = new FormData();
    formData.append('id', data.id);
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id') return;
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    if (deletedImageId) {
      formData.append('deletedImage', deletedImageId);
    }
    if (image) {
      formData.append('image', image);
    }
    formData.append('isFeatured', String(isFeatured));

    toast.loading('Updating article...');
    try {
      const response = await axios.put(
        '/api/dashboard/single-article',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      toast.dismiss();
      if (response.status === 200) {
        toast.success('Article updated successfully');
      }
    } catch {
      toast.dismiss();
      toast.error('Failed to update article');
    }
  }

  if (isPending) return <ArticleSkeleton />;

  if (isError) {
    return (
      <div className='flex h-100 flex-col items-center justify-center p-6 text-center'>
        <h3 className='text-lg font-medium'>Failed to load article</h3>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='container mx-auto space-y-8 px-4 py-6'
      >
        <div className='flex flex-wrap items-center gap-4 border-b pb-6'>
          <Link href='/dashboard/admin/content/articles'>
            <Button variant='outline' type='button' size='icon'>
              <ChevronLeft className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Edit Article</h1>
            <p className='text-sm text-muted-foreground'>
              Update your article details.
            </p>
          </div>
          <div className='ml-auto flex gap-3'>
            <Button
              variant='ghost'
              type='button'
              onClick={resetForm}
              disabled={!isDirty}
            >
              Discard Changes
            </Button>
            <Button type='submit' className='px-8'>
              Save Changes
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          <div className='space-y-6 lg:col-span-8'>
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

            <Controller
              control={control}
              name='content'
              render={({ field }) => (
                <Field>
                  <FieldLabel>Content</FieldLabel>
                  <TiptapEditor
                    ref={editorRef}
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

          <div className='space-y-6 lg:col-span-4'>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <Label>Featured Article</Label>
                    <p className='text-xs text-muted-foreground'>
                      Show this on the homepage hero section.
                    </p>
                  </div>
                  <Switch
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                </div>

                <Controller
                  control={control}
                  name='category'
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={categoriesLoading}
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

            <EditArticleImage
              image={image}
              existingImage={existingImage}
              setImage={setImage}
              onRemove={handleRemoveImage}
            />
            <TagInputSection />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function TagInputSection() {
  const { control, setValue, watch } = useFormContext<EditArticleSchemaType>();
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
          {tags.map((tag) => (
            <Badge key={`tag-${tag}`} variant='secondary'>
              {tag}
              <X
                className='ml-1 h-3 w-3 cursor-pointer'
                onClick={() =>
                  setValue(
                    'tags',
                    tags.filter((t) => t !== tag),
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
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addTag())
            }
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

interface EditArticleImageProps {
  image: File | null;
  existingImage: string | null;
  setImage: (file: File | null) => void;
  onRemove: () => void;
}

function EditArticleImage({
  image,
  existingImage,
  setImage,
  onRemove,
}: EditArticleImageProps) {
  const showPreview = image ? URL.createObjectURL(image) : existingImage;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
      </CardHeader>
      <CardContent>
        {showPreview ? (
          <div className='relative aspect-video w-full overflow-hidden rounded-md border'>
            <Image
              src={showPreview}
              alt='Preview'
              fill
              className='object-cover'
            />
            <Button
              variant='destructive'
              size='icon'
              className='absolute right-2 top-2'
              onClick={onRemove}
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
