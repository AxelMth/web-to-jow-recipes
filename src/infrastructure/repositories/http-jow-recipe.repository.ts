import { Recipe } from '../../domain/entities/recipe';
import { axiosInstance } from '../http/axios-instance';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { JowRecipeAdapter } from '../adapters/jow-recipe.adapter';

export class HttpJowRecipeRepository implements RecipeTargetRepository {
  async saveRecipe(recipe: Recipe): Promise<Recipe> {
    await axiosInstance.post(`${process.env.JOW_URL}`, JowRecipeAdapter.toJow(recipe), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.JOW_BEARER_TOKEN}`
      }
    });
    return recipe
  }
}