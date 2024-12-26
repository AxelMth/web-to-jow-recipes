import { z } from "zod";

import { Recipe } from "@/domain/entities/recipe";
import { Ingredient } from "@/domain/entities/ingredient";
import { Step } from "@/domain/entities/step";
import { Duration } from "@/domain/value-objects/duration";
import { sourceRecipeSchema } from "@/presentation/schemas/source-recipe.schema";

export class SourceRecipeAdapter {
  static toDomain(sourceData: z.infer<typeof sourceRecipeSchema>): Recipe {
    return new Recipe(
      sourceData.id,
      sourceData.name,
      sourceData.ingredients.map(ing => new Ingredient(
        ing.id,
        ing.name,
        ing.imageLink,
        'unit',
        1
      )),
      sourceData.steps.map(step => new Step(
        step.text,
        step.imageUrl
      )),
      Duration.fromPTFormat(sourceData.prepTime),
      Duration.fromPTFormat(sourceData.totalTime),
      sourceData.imageUrl,
      sourceData.servingSize
    );
  }
}