import * as z from 'zod';

// Helper for slug validation
const slugRegex = /^[a-z0-9-]+$/;

export const NewArticleSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200)
    .trim(),
  // Added the slug field
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      slugRegex,
      'Slug must only contain lowercase letters, numbers, and hyphens',
    ),
  tags: z.array(z.string()),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
});

export type NewArticleSchemaType = z.infer<typeof NewArticleSchema>;

export const EditArticleSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200)
    .trim(),
  // Added the slug field
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      slugRegex,
      'Slug must only contain lowercase letters, numbers, and hyphens',
    ),
  tags: z.array(z.string()),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});

export type EditArticleSchemaType = z.infer<typeof EditArticleSchema>;

// Keeping your original articleSchema if needed for other parts of the app
export const articleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  image: z.instanceof(File).optional(),
});
export type ArticleFormValues = z.infer<typeof articleSchema>;
