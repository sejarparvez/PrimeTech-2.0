import * as z from 'zod';

export const articleSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  image: z.instanceof(File).optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

export const NewArticleSchema = z.object({
  title: z
    .string()
    .min(10, 'Name must be at least 10 characters')
    .max(200)
    .trim()
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      'Name should not contain special characters like - _ +'
    ),
  tags: z.array(z.string()),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});
export type NewArticleSchemaType = z.infer<typeof NewArticleSchema>;

export const EditArticleSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(10, 'Name must be at least 10 characters')
    .max(200)
    .trim()
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      'Name should not contain special characters like - _ +'
    ),
  tags: z.array(z.string()),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});
export type EditArticleSchemaType = z.infer<typeof EditArticleSchema>;
