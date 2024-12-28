import { Recipe } from '../../../domain/entities/recipe';

export interface RecipeTargetRepository {
  saveRecipe(recipe: Recipe): Promise<Recipe>;
}
