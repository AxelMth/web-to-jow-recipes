import axios from 'axios';

import { Recipe } from '../../domain/entities/recipe';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { JowRecipeAdapter } from '../adapters/jow-recipe.adapter';
import { jowRecipeSchema } from '../../presentation/schemas/jow-recipe.schema';

export class HttpJowRecipeRepository implements RecipeTargetRepository {
  async saveRecipe(recipe: Recipe): Promise<Recipe> {
    await axios.post(`${process.env.JOW_URL}`, JowRecipeAdapter.toJow(recipe), {
      headers: {
        Authorization: `Bearer ${process.env.JOW_BEARER_TOKEN}`,
      },
    });
    return recipe;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const limit = 50;
    let start = 0;
    let allRecipes: Recipe[] = [];
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        `${process.env.JOW_URL}?start=${start}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.JOW_BEARER_TOKEN}`,
          },
        }
      );

      const recipes = jowRecipeSchema.array().parse(response.data.recipes);
      allRecipes = [
        ...allRecipes,
        ...recipes.map((data: any) => JowRecipeAdapter.toDomain(data)),
      ];

      if (recipes.length < limit) {
        hasMore = false;
      }
      start += limit;
    }

    return allRecipes;
  }

  async deleteRecipeById(id: string): Promise<void> {
    console.log(`Deleting recipe with id ${id}...`);
    await axios.delete(`${process.env.JOW_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.JOW_BEARER_TOKEN}`,
      },
    });
  }

  async uploadImage(recipeId: string, image: Buffer): Promise<void> {
    console.log(`Uploading image for recipe with id ${recipeId}...`);
    await axios.post(`${process.env.JOW_URL}/${recipeId}/image`, image, {
      headers: {
        Authorization: `Bearer ${process.env.JOW_BEARER_TOKEN}`,
      },
    });
  }
}
