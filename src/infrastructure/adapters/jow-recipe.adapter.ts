import { z } from "zod";
import { Recipe } from "../../domain/entities/recipe";
import { jowRecipeSchema } from "../../presentation/schemas/jow-recipe.schema";

export class JowRecipeAdapter {
  static toJow(recipe: Recipe): z.infer<typeof jowRecipeSchema> {
    return {
      additionalConstituents: [],
      backgroundPattern: {
        color: "#fcb2b0",
        imageUrl: "patterns/raddish-04.png"
      },
      constituents: recipe.ingredients.map(ing => ({
        ingredient: {
          id: ing.id,
          name: ing.name,
          imageUrl: ing.imageUrl,
          naturalUnit: {
            measurementSystemCompatibility: {
              metric: true,
              imperial: false,
              us: false
            },
            name: ing.unit,
            _id: `unit_${ing.id}`,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isNatural: true,
            __v: 0,
            abbreviations: [{
              label: ing.unit,
              digits: 0,
              divisor: 1,
              inverse: false,
              _id: `abbr_${ing.id}`,
              minAmount: 0,
              id: `abbr_${ing.id}`
            }],
            id: `unit_${ing.id}`
          },
          displayableUnits: [],
          _id: ing.id,
          isBasicIngredient: true,
          alternativeUnits: [],
          isAdditionalConstituent: false,
          scores: [0],
          boldName: `{{${ing.name}}}`
        },
        quantityPerCover: ing.quantity || 1,
        unit: {
          measurementSystemCompatibility: {
            metric: true,
            imperial: false,
            us: false
          },
          name: ing.unit,
          _id: `unit_${ing.id}`,
          abbreviations: [],
          id: `unit_${ing.id}`
        }
      })),
      cookingTime: String(recipe.totalTime.toMinutes() - recipe.prepTime.toMinutes()),
      directions: recipe.steps.map(() => ({
        label: "Étape",
        involvedIngredients: []
      })),
      recipeFamily: "default",
      requiredTools: [],
      imageUrl: recipe.imageUrl || "",
      placeHolderUrl: "placeholders/plate.png",
      preparationTime: String(recipe.prepTime.toMinutes()),
      restingTime: 0,
      staticCoversCount: false,
      tip: {
        description: ""
      },
      title: recipe.name,
      userConstituents: [],
      userCoversCount: recipe.servingSize || 4
    };
  }
}