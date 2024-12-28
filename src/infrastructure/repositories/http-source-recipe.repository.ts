import axios from 'axios';

import { Recipe } from '../../domain/entities/recipe';
import { RecipeSourceRepository } from '../../application/ports/output/recipe-source.repository';
import { sourceResponseSchema } from '../../presentation/schemas/source-recipe.schema';
// import { axiosInstance, resetAxiosInstance } from '../http/axios-instance';
import { SourceRecipeAdapter } from '../adapters/source-recipe.adapter';

export class HttpSourceRecipeRepository implements RecipeSourceRepository {
  async fetchPaginatedRecipes(page: number): Promise<Recipe[]> {
    // resetAxiosInstance();
    const response = await axios.get(
      `${process.env.SOURCE_URL}?country=fr&locale=fr-FR&not-author=thermomix&order=-date&product=classic-box%7Cclassic-menu%7Cclassic-plan&skip=${page - 1}&take=${5}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SOURCE_BEARER_TOKEN}`,
        },
      }
    );
    const validatedData = sourceResponseSchema.parse(response.data);
    return validatedData.items.map(data => SourceRecipeAdapter.toDomain(data));
  }
}
