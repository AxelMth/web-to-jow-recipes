import { z } from 'zod';

const measurementSystemSchema = z.object({
  metric: z.boolean(),
  imperial: z.boolean(),
  us: z.boolean(),
});

const abbreviationSchema = z.object({
  label: z.string().or(z.null()),
  digits: z.number(),
  divisor: z.number(),
  inverse: z.boolean(),
  _id: z.string(),
  minAmount: z.number(),
  maxAmount: z.number().optional(),
  id: z.string(),
});

const unitSchema = z.object({
  measurementSystemCompatibility: measurementSystemSchema.optional(),
  name: z.string(),
  _id: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  isNatural: z.boolean().optional(),
  __v: z.number(),
  abbreviations: z.array(abbreviationSchema),
  comments: z.string().optional(),
  id: z.string(),
});

const alternativeUnitSchema = z.object({
  _id: z.string().optional(),
  unit: unitSchema,
  quantity: z.number(),
  id: z.string().nullable(),
});

const displayableUnitSchema = z.object({
  label: z.string(),
  name: z.string(),
  abbreviationId: z.string(),
  unit: unitSchema,
});

export const ingredientSchema = z.object({
  id: z.string(),
  _id: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  isBasicIngredient: z.boolean(),
  naturalUnit: unitSchema,
  alternativeUnits: z.array(alternativeUnitSchema),
  displayableUnits: z.array(displayableUnitSchema),
  isAdditionalConstituent: z.boolean(),
  scores: z.array(z.number()),
  boldName: z.string().optional(),
  boldKeywords: z.string().optional(),
});
