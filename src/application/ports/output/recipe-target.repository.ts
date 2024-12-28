import { Recipe } from '../../../domain/entities/recipe';

export interface RecipeTargetRepository {
  saveRecipe(recipe: Recipe): Promise<Recipe>;
  getAllRecipes(): Promise<Recipe[]>;
  deleteRecipeById(id: string): Promise<void>;
}
