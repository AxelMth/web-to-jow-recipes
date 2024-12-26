import { Recipe } from "../../domain/entities/recipe";
import { z } from "zod";
import { jowRecipeSchema } from "../../presentation/schemas/jow-recipe.schema";

export class JowRecipeAdapter {
  static toJow(recipe: Recipe): z.infer<typeof jowRecipeSchema> {
    return {
      additionalConstituents: [],
      backgroundPattern: {
        color: "white",
        imageUrl: ""
      },
      constituents: recipe.ingredients.map(ing => ({
        ingredient: {
          id: ing.id,
          name: ing.name,
          imageUrl: ing.imageUrl,
          naturalUnit: { name: ing.unit, ratio: 1 },
          displayableUnits: [],
          isBasicIngredient: true,
          alternativeUnits: [],
          isAdditionalConstituent: false,
          scores: [],
          boldName: ing.name
        },
        quantityPerCover: ing.quantity,
        unit: { name: ing.unit, ratio: 1 }
      })),
      cookingTime: recipe.totalTime.toMinutes() - recipe.prepTime.toMinutes(),
      directions: recipe.steps.map((step, idx) => ({
        description: step.description,
        imageUrl: step.imageUrl,
        title: step.title || `Step ${idx + 1}`
      })),
      recipeFamily: "",
      requiredTools: [],
      imageUrl: recipe.imageUrl || "",
      placeHolderUrl: "",
      preparationTime: recipe.prepTime.toMinutes(),
      restingTime: 0,
      staticCoversCount: false,
      tip: { content: "" },
      title: recipe.name,
      userConstituents: [],
      userCoversCount: recipe.servingSize || 4
    };
  }
}