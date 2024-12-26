import { Recipe } from '@/domain/entities/recipe';
import { RecipeSourceRepository } from '@/application/ports/output/recipe-source.repository';
import { sourceRecipeSchema } from '@/presentation/schemas/source-recipe.schema';
import { axiosInstance } from '../http/axios-instance';
import { Duration } from '../../domain/value-objects/duration';

export class HttpSourceRecipeRepository implements RecipeSourceRepository {
  async fetchPaginatedRecipes(page: number): Promise<Recipe[]> {
    const response = await axiosInstance.get(`${process.env.SOURCE_URL}?page=${page}`);
    const validatedData = sourceRecipeSchema.array().parse(response.data);
    
    return validatedData.map(data => new Recipe(
      data.id,
      data.name,
      data.ingredients,
      data.steps,
      this.parseDuration(data.prepTime),
      this.parseDuration(data.totalTime)
    ));
  }

  private parseDuration(duration: string): Duration {
    return Duration.fromPTFormat(duration);
  }
}