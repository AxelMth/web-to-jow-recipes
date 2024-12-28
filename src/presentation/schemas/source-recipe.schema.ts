import { z } from 'zod';

// Nested schemas
const allergenSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  slug: z.string(),
  iconLink: z.string().nullable().or(z.undefined()),
  iconPath: z.string().nullable().or(z.undefined()),
  triggersTracesOf: z.boolean(),
  tracesOf: z.boolean(),
});

const cuisineSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  slug: z.string(),
  iconLink: z.string(),
});

const familySchema = z.object({
  id: z.string(),
  uuid: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  priority: z.number(),
  iconLink: z.string().nullable(),
  iconPath: z.string().nullable(),
});

const ingredientSchema = z.object({
  id: z.string(),
  uuid: z.string(),
  name: z.string(),
  type: z.string(),
  slug: z.string(),
  country: z.string(),
  imageLink: z.string(),
  imagePath: z.string(),
  shipped: z.boolean(),
  allergens: z.array(z.string()),
  family: familySchema,
});

const stepSchema = z.object({
  index: z.number(),
  instructions: z.string(),
  instructionsHTML: z.string(),
  instructionsMarkdown: z.string(),
  ingredients: z.array(z.any()),
  utensils: z.array(z.string()),
  timers: z.array(z.any()),
  images: z.array(
    z.object({
      link: z.string(),
      path: z.string(),
      caption: z.string(),
    })
  ),
  videos: z.array(z.any()),
});

const tagSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  slug: z.string(),
  colorHandle: z.string().nullable(),
  preferences: z.array(z.string()),
  displayLabel: z.boolean(),
});

const utensilSchema = z.object({
  id: z.string(),
  type: z.string().nullable(),
  name: z.string(),
});

const yieldSchema = z.object({
  yields: z.number(),
  ingredients: z.array(
    z.object({
      id: z.string(),
      amount: z.number().nullable(),
      unit: z.string(),
    })
  ),
});

// Main recipe schema
export const sourceRecipeSchema = z.object({
  active: z.boolean(),
  allergens: z.array(allergenSchema),
  averageRating: z.number(),
  canonical: z.string(),
  canonicalLink: z.string().nullable(),
  cardLink: z.string().nullable(),
  category: z.string().nullable(),
  clonedFrom: z.string(),
  comment: z.string().nullable(),
  country: z.string(),
  createdAt: z.string(),
  cuisines: z.array(cuisineSchema),
  description: z.string(),
  descriptionHTML: z.string(),
  descriptionMarkdown: z.string(),
  difficulty: z.number(),
  favoritesCount: z.number(),
  headline: z.string(),
  id: z.string(),
  imageLink: z.string(),
  imagePath: z.string(),
  ingredients: z.array(ingredientSchema),
  isAddon: z.boolean(),
  isComplete: z.boolean().nullable(),
  isPublished: z.boolean(),
  label: z
    .string()
    .or(
      z.object({
        text: z.string(),
      })
    )
    .nullable(),
  link: z.string(),
  name: z.string(),
  prepTime: z.string(),
  promotion: z.string().nullable(),
  ratingsCount: z.number(),
  servingSize: z.number(),
  slug: z.string(),
  steps: z.array(stepSchema),
  tags: z.array(tagSchema),
  totalTime: z.string(),
  uniqueRecipeCode: z.string(),
  updatedAt: z.string(),
  utensils: z.array(utensilSchema),
  uuid: z.string(),
  videoLink: z.string().nullable(),
  websiteUrl: z.string(),
  yields: z.array(yieldSchema),
});

// Response schema
export const sourceResponseSchema = z.object({
  items: z.array(sourceRecipeSchema),
  take: z.number(),
  skip: z.number(),
  count: z.number(),
  total: z.number(),
});

export type SourceRecipe = z.infer<typeof sourceRecipeSchema>;
export type SourceResponse = z.infer<typeof sourceResponseSchema>;
