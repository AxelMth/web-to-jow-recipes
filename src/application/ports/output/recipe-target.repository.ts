import { Recipe } from '../../../domain/entities/recipe';

export interface RecipeTargetRepository {
  saveRecipe(recipe: Recipe): Promise<Recipe>;
  uploadImage(imageUrl: string): Promise<{ uploadedImageUrl: string }>;
  getAllRecipes(): Promise<Recipe[]>;
  deleteRecipeById(id: string): Promise<void>;
}
