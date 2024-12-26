import { Recipe } from '../../domain/entities/recipe';
import { RecipeSourceRepository } from '../../application/ports/output/recipe-source.repository';
import { sourceRecipeSchema } from '../../presentation/schemas/source-recipe.schema';
import { axiosInstance } from '../http/axios-instance';
import { SourceRecipeAdapter } from '../adapters/source-recipe.adapter';

export class HttpSourceRecipeRepository implements RecipeSourceRepository {
  async fetchPaginatedRecipes(page: number): Promise<Recipe[]> {
    const response = await axiosInstance.get(`${process.env.SOURCE_URL}?page=${page}`);
    const validatedData = sourceRecipeSchema.array().parse(response.data);
    return validatedData.map(data => SourceRecipeAdapter.toDomain(data));
  }
}