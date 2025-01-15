import { z } from "zod";

export const NewArticleSchema = z.object({
  title: z
    .string()
    .min(10, "Name must be at least 10 characters")
    .max(200)
    .trim()
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Name should not contain special characters like - _ +",
    ),
  tags: z.array(z.string()),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
});
export type NewArticleSchemaType = z.infer<typeof NewArticleSchema>;
