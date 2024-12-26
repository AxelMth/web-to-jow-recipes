import { z } from 'zod';

export const sourceRecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.object({
    id: z.string(),
    name: z.string(),
    imageLink: z.string(),
  })),
  steps: z.array(z.object({
    text: z.string(),
    imageUrl: z.string().optional(),
  })),
  prepTime: z.string(),
  totalTime: z.string(),
  imageUrl: z.string().optional(),
  servingSize: z.number().optional(),
});

export type SourceRecipe = z.infer<typeof sourceRecipeSchema>;