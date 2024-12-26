import { z } from "zod";

// Nested schemas
const measurementSystemSchema = z.object({
  metric: z.boolean(),
  imperial: z.boolean(),
  us: z.boolean()
});

const abbreviationSchema = z.object({
  label: z.string(),
  digits: z.number(),
  divisor: z.number(),
  inverse: z.boolean(),
  _id: z.string(),
  minAmount: z.number(),
  maxAmount: z.number().optional(),
  id: z.string()
});

const unitSchema = z.object({
  measurementSystemCompatibility: measurementSystemSchema,
  name: z.string(),
  _id: z.string(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  isNatural: z.boolean().optional(),
  __v: z.number().optional(),
  abbreviations: z.array(abbreviationSchema),
  comments: z.string().optional(),
  id: z.string()
});

const displayableUnitSchema = z.object({
  label: z.string(),
  name: z.string(),
  abbreviationId: z.string(),
  unit: unitSchema
});

const alternativeUnitSchema = z.object({
  _id: z.string(),
  unit: unitSchema,
  quantity: z.number(),
  id: z.string()
});

const ingredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  naturalUnit: unitSchema,
  displayableUnits: z.array(displayableUnitSchema),
  _id: z.string().optional(),
  isBasicIngredient: z.boolean(),
  alternativeUnits: z.array(alternativeUnitSchema),
  isAdditionalConstituent: z.boolean(),
  scores: z.array(z.number()),
  boldName: z.string()
});

const constituentSchema = z.object({
  ingredient: ingredientSchema,
  quantityPerCover: z.number(),
  unit: unitSchema
});

const directionSchema = z.object({
  label: z.string(),
  involvedIngredients: z.array(z.any())
});

const toolSchema = z.object({
  isNotTrivial: z.boolean(),
  availabilityZones: z.array(z.string()),
  _id: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  __v: z.number(),
  id: z.string(),
  name: z.string(),
  isDefaultChecked: z.boolean(),
  imageUrl: z.string(),
  childrenTools: z.array(z.any())
});

// Main recipe schema
export const jowRecipeSchema = z.object({
  additionalConstituents: z.array(z.any()),
  backgroundPattern: z.object({
    color: z.string(),
    imageUrl: z.string()
  }),
  constituents: z.array(constituentSchema),
  cookingTime: z.string(),
  directions: z.array(directionSchema),
  recipeFamily: z.string(),
  requiredTools: z.array(toolSchema),
  imageUrl: z.string(),
  placeHolderUrl: z.string(),
  preparationTime: z.string(),
  restingTime: z.number(),
  staticCoversCount: z.boolean(),
  tip: z.object({
    description: z.string().optional()
  }),
  title: z.string(),
  userConstituents: z.array(z.any()),
  userCoversCount: z.number()
});

export type JowRecipe = z.infer<typeof jowRecipeSchema>;