import { z } from 'zod';

import { Recipe } from '../../domain/entities/recipe';
import { Ingredient } from '../../domain/entities/ingredient';
import { Step } from '../../domain/entities/step';
import { Duration } from '../../domain/value-objects/duration';
import { sourceRecipeSchema } from '../../presentation/schemas/source-recipe.schema';

export class SourceRecipeAdapter {
  private static ingredientsToIgnore = [
    // Pepper & Salt
    '63e5122b81b4b295e66f025e',
  ];
  static toDomain(sourceData: z.infer<typeof sourceRecipeSchema>): Recipe {
    const yields = sourceData.yields.find(y => y.yields === 1);
    const ingredients = sourceData.ingredients
      .filter(ing => !SourceRecipeAdapter.ingredientsToIgnore.includes(ing.id))
      .map(ing => {
        const foundIngredient = yields?.ingredients.find(
          yieldIng => yieldIng.id === ing.id
        );
        return new Ingredient(
          ing.id,
          ing.name,
          ing.imageLink || '',
          {
            id: foundIngredient?.unit || '',
            name: foundIngredient?.unit || '',
            divisor: 1,
          },
          foundIngredient?.amount || 0
        );
      });
    return new Recipe(
      sourceData.id,
      sourceData.name,
      ingredients,
      sourceData.steps.map(step => new Step(step.instructions)),
      Duration.fromPTFormat(sourceData.prepTime),
      Duration.fromPTFormat(sourceData.totalTime),
      sourceData.imagePath
    );
  }
}
