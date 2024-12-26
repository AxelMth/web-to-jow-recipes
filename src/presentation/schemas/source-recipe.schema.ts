// src/presentation/schemas/source-recipe.schema.ts
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
});

export type SourceRecipe = z.infer<typeof sourceRecipeSchema>;