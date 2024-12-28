import { Recipe } from '../../../domain/entities/recipe';

export interface RecipeSourceRepository {
  fetchPaginatedRecipes(
    page: number,
    itemsPerPage: number
  ): Promise<{
    recipes: Recipe[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }>;
}
