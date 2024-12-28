import z from 'zod';

import { Ingredient } from '../../domain/entities/ingredient';
import { Recipe } from '../../domain/entities/recipe';
import { jowRecipeSchema } from '../../presentation/schemas/jow-recipe.schema';
import { Duration } from '../../domain/value-objects/duration';
import { Step } from '../../domain/entities/step';
import { Unit } from '../../domain/entities/unit';

export class JowRecipeAdapter {
  static toJow(recipe: Recipe): z.infer<typeof jowRecipeSchema> {
    return {
      _id: recipe.id,
      additionalConstituents: [],
      backgroundPattern: {
        color: '#fcb2b0',
        imageUrl: 'patterns/raddish-04.png',
      },
      constituents: recipe.ingredients.map(ing => ({
        ingredient: {
          id: ing.id,
          name: ing.name,
          imageUrl: ing.imageUrl,
          _id: ing.id,
          isBasicIngredient: true,
          isAdditionalConstituent: false,
          scores: [0],
          boldName: `{{${ing.name}}}`,
        },
        quantityPerCover: Math.abs(ing.quantity),
        unit: this.getStandardUnit(ing),
      })),
      cookingTime: Math.abs(
        recipe.totalTime.toMinutes() - recipe.prepTime.toMinutes()
      ),
      directions: recipe.steps.map(step => ({
        label: step.description.replace(/\\n/g, '\n').trim(),
        involvedIngredients: [],
      })),
      recipeFamily: '5fc78542aaaddb03d10f47bc',
      requiredTools: this.getDefaultTools(),
      imageUrl: recipe.imageUrl || '',
      placeHolderUrl: 'placeholders/plate.png',
      preparationTime: recipe.prepTime.toMinutes(),
      restingTime: 0,
      staticCoversCount: false,
      tip: {
        description: '',
      },
      title: recipe.name,
      userConstituents: [],
      userCoversCount: recipe.servingSize || 4,
    };
  }

  static toDomain(data: z.infer<typeof jowRecipeSchema>): Recipe {
    return new Recipe(
      data._id,
      data.title,
      data.constituents.map(
        ing =>
          new Ingredient(
            ing.ingredient.id,
            ing.ingredient.name,
            ing.ingredient.imageUrl,
            new Unit(ing.unit.id, ing.unit.name, 1),
            ing.quantityPerCover
          )
      ),
      data.directions.map(step => new Step(step.label)),
      new Duration(Number(data.preparationTime)),
      new Duration(Number(data.cookingTime)),
      data.imageUrl
    );
  }

  private static getDefaultAbbreviations(id: string) {
    // Implementation of default abbreviations
    return [];
  }

  private static getDisplayableUnits(ingredient: Ingredient) {
    // Implementation of displayable units
    return [];
  }

  private static getAlternativeUnits(ingredient: Ingredient) {
    // Implementation of alternative units
    return [];
  }

  private static getStandardUnit(ingredient: Ingredient) {
    return {
      measurementSystemCompatibility: {
        metric: true,
        imperial: false,
        us: false,
      },
      name: ingredient.unit.name,
      _id: ingredient.unit.id,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isNatural: true,
      __v: 14,
      abbreviations: this.getDefaultAbbreviations(ingredient.unit.id),
      id: ingredient.unit.id,
    };
  }

  private static getDefaultTools() {
    // Implementation of default tools
    return [];
  }
}
