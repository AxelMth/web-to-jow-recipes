import axios from 'axios';

import { Recipe } from '../../domain/entities/recipe';
// import { axiosInstance, resetAxiosInstance } from '../http/axios-instance';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { JowRecipeAdapter } from '../adapters/jow-recipe.adapter';

export class HttpJowRecipeRepository implements RecipeTargetRepository {
  async saveRecipe(recipe: Recipe): Promise<Recipe> {
    // resetAxiosInstance();
    // console.log('Jow Base URL:', process.env.JOW_BEARER_TOKEN);
    await axios.post(`${process.env.JOW_URL}`, JowRecipeAdapter.toJow(recipe), {
      headers: {
        Authorization: `Bearer ${process.env.JOW_BEARER_TOKEN}`,
      },
    });
    return recipe;
  }
}
