import { z } from "zod";

export const jowRecipeSchema = z.object({
  additionalConstituents: z.array(z.any()),
  backgroundPattern: z.object({
    color: z.string(),
    imageUrl: z.string()
  }),
  constituents: z.array(z.object({
    ingredient: z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string(),
      naturalUnit: z.object({
        name: z.string(),
        ratio: z.number()
      }),
      displayableUnits: z.array(z.any()),
      isBasicIngredient: z.boolean(),
      alternativeUnits: z.array(z.any()),
      isAdditionalConstituent: z.boolean(),
      scores: z.array(z.any()),
      boldName: z.string()
    }),
    quantityPerCover: z.number(),
    unit: z.object({
      name: z.string(),
      ratio: z.number()
    })
  })),
  cookingTime: z.number(),
  directions: z.array(z.object({
    description: z.string(),
    imageUrl: z.string().optional(),
    title: z.string()
  })),
  recipeFamily: z.string(),
  requiredTools: z.array(z.any()),
  imageUrl: z.string(),
  placeHolderUrl: z.string(),
  preparationTime: z.number(),
  restingTime: z.number(),
  staticCoversCount: z.boolean(),
  tip: z.object({
    content: z.string()
  }),
  title: z.string(),
  userConstituents: z.array(z.any()),
  userCoversCount: z.number()
});

export type JowRecipe = z.infer<typeof jowRecipeSchema>;