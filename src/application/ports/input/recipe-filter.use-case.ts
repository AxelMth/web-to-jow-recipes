import { Recipe } from '../../../domain/entities/recipe';

export interface RecipeFilterUseCase {
  filterRecipesByIngredients(recipes: Recipe[]): Recipe[];
  filterAlreadyProcessedRecipes(recipe: Recipe[]): Promise<Recipe[]>;
}
