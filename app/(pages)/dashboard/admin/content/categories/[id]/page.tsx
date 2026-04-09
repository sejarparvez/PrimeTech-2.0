'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

import { useSession } from '@/lib/auth-client';
import { isAdmin } from '@/lib/auth-utils';
import { useSingleCategory, useUpdateCategory } from '@/services/categories';

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .transform((val) => val ?? ''),
});

type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

const CategoryFormSkeleton = () => (
  <div className='max-w-2xl mx-auto'>
    <div className='mb-8'>
      <Skeleton className='h-9 w-48 mb-2' />
      <Skeleton className='h-5 w-64' />
    </div>
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-32 mb-2' />
        <Skeleton className='h-4 w-56' />
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-32 w-full' />
        </div>
        <div className='flex gap-3 pt-4'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-24' />
        </div>
      </CardContent>
    </Card>
  </div>
);

const CategoryForm = ({
  categoryId,
  initialName,
  initialDescription,
}: {
  categoryId: string;
  initialName: string;
  initialDescription: string;
}) => {
  const router = useRouter();
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    mode: 'onBlur',
    defaultValues: {
      name: initialName,
      description: initialDescription,
    },
  });

  const nameValue = watch('name') || '';
  const descriptionValue = watch('description') || '';

  const onSubmit = (data: UpdateCategoryFormData) => {
    updateCategory(
      { id: categoryId, formData: data },
      {
        onSuccess: () => {
          router.push('/dashboard/admin/content/categories');
        },
      },
    );
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Edit Category</h1>
        <p className='text-muted-foreground mt-2'>
          Update the category details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Modify the information below to update this category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <Field>
              <FieldLabel htmlFor='name'>Category Name</FieldLabel>
              <FieldContent>
                <Input
                  id='name'
                  placeholder='Enter category name'
                  {...register('name')}
                  disabled={isPending}
                  maxLength={100}
                />
                <div className='flex items-center justify-between mt-1'>
                  {errors.name ? (
                    <FieldError>{errors.name.message}</FieldError>
                  ) : (
                    <div />
                  )}
                  <p className='text-xs text-muted-foreground'>
                    {nameValue.length}/100
                  </p>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor='description'>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  id='description'
                  placeholder='Enter category description (optional)'
                  {...register('description')}
                  disabled={isPending}
                  maxLength={500}
                  rows={5}
                />
                <div className='flex items-center justify-between mt-1'>
                  {errors.description ? (
                    <FieldError>{errors.description.message}</FieldError>
                  ) : (
                    <div />
                  )}
                  <p className='text-xs text-muted-foreground'>
                    {descriptionValue.length}/500
                  </p>
                </div>
              </FieldContent>
            </Field>

            <div className='flex gap-3 pt-4'>
              <Button type='submit' disabled={isPending} className='min-w-32'>
                {isPending ? (
                  <>
                    <Spinner className='mr-2 h-4 w-4' />
                    Updating...
                  </>
                ) : (
                  'Update Category'
                )}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, isPending: isSessionPending } = useSession();

  if (isSessionPending) {
    return (
      <div className='min-h-screen bg-background p-4 md:p-8'>
        <CategoryFormSkeleton />
      </div>
    );
  }

  if (!isAdmin(session)) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='text-center'>
          <p className='text-xl font-semibold mb-2'>Access Denied</p>
          <p className='text-muted-foreground'>
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <EditCategoryForm params={params} />;
}

function EditCategoryForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: category, isPending, isError } = useSingleCategory(id);

  if (isPending) {
    return (
      <div className='min-h-screen bg-background p-4 md:p-8'>
        <CategoryFormSkeleton />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='text-center'>
          <p className='text-xl font-semibold mb-2'>Category Not Found</p>
          <p className='text-muted-foreground'>
            The requested category does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-4 md:p-8'>
      <CategoryForm
        categoryId={id}
        initialName={category.name}
        initialDescription={category.description || ''}
      />
    </div>
  );
}
