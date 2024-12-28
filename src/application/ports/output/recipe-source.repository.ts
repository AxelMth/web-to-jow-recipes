import { Recipe } from '../../../domain/entities/recipe';

export interface RecipeSourceRepository {
  fetchPaginatedRecipes(page: number): Promise<Recipe[]>;
}
