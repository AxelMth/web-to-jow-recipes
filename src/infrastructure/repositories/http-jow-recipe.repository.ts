import { Recipe } from '../../domain/entities/recipe';
import { sourceRecipeSchema } from '../../presentation/schemas/source-recipe.schema';
import { axiosInstance } from '../http/axios-instance';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { SourceRecipeAdapter } from '../../infrastructure/adapters/source-recipe.adapter';

export class HttpJowRecipeRepository implements RecipeTargetRepository {
  async saveRecipe(recipe: Recipe): Promise<Recipe[]> {
    const response = await axiosInstance.post(`${process.env.JOW_URL}`, recipe);
    const validatedData = sourceRecipeSchema.array().parse(response.data);
    return validatedData.map(data => SourceRecipeAdapter.toDomain(data));
  }
}