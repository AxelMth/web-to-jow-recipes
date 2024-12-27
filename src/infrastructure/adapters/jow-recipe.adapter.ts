import z from "zod";

import { Ingredient } from "@/domain/entities/ingredient";
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
            _id: ing.id,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isNatural: true,
            __v: 14,
            abbreviations: this.getDefaultAbbreviations(ing.id),
            id: `${ing.id}`
          },
          displayableUnits: this.getDisplayableUnits(ing),
          _id: ing.id,
          isBasicIngredient: false,
          alternativeUnits: this.getAlternativeUnits(ing),
          isAdditionalConstituent: false,
          scores: [0],
          boldName: `{{${ing.name}}}`
        },
        quantityPerCover: Math.abs(ing.quantity),
        unit: this.getStandardUnit(ing)
      })),
      cookingTime: String(Math.abs(recipe.totalTime.toMinutes() - recipe.prepTime.toMinutes())),
      directions: recipe.steps.map(step => ({
        label: step.description.replace(/\\n/g, '\n').trim(),
        involvedIngredients: []
      })),
      recipeFamily: "5fc78542aaaddb03d10f47bc",
      requiredTools: this.getDefaultTools(),
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

  private static getDefaultAbbreviations(id: string) {
    // Implementation of default abbreviations
    return []
  }

  private static getDisplayableUnits(ingredient: Ingredient) {
    // Implementation of displayable units
    return []
  }

  private static getAlternativeUnits(ingredient: Ingredient) {
    // Implementation of alternative units
    return []
  }

  private static getStandardUnit(ingredient: Ingredient) {
    // Implementation of standard unit
    return {
      measurementSystemCompatibility: {
        metric: true,
        imperial: false,
        us: false
      },
      name: ingredient.unit,
      _id: `${ingredient.id}`,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isNatural: true,
      __v: 14,
      abbreviations: this.getDefaultAbbreviations(ingredient.id),
      id: ingredient.id
    };
  }

  private static getDefaultTools() {
    // Implementation of default tools
    return []
  }
}