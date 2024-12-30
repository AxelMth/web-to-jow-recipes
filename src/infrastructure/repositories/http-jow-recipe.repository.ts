import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { readFile, writeFile } from 'node:fs/promises';

import { Recipe } from '../../domain/entities/recipe';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { JowRecipeAdapter } from '../adapters/jow-recipe.adapter';
import { jowRecipeSchema } from '../../presentation/schemas/jow-recipe.schema';
import { read } from 'node:fs';
import { exec, execSync } from 'node:child_process';

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

  async uploadImage(imageUrl: string): Promise<{ uploadedImageUrl: string }> {
    // `https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_500/hellofresh_s3/${imageUrl}`,
    const image = await axios.get(
      `https://img.hellofresh.com/c_fit,f_auto,fl_lossy,h_500,q_50,w_500/hellofresh_s3/${imageUrl}`,
      {
        responseType: 'arraybuffer',
      }
    );
    await writeFile('image.jpg', image.data);

    const data = new FormData();
    data.append('image', fs.createReadStream('image.jpg'));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.jow.fr/public/recipes/uploaded/image',
      headers: {
        accept: 'application/json',
        'accept-language': 'fr',
        authorization: 'Bearer ' + process.env.JOW_BEARER_TOKEN,
        ...data.getHeaders(),
      },
      data,
    };

    const result = await axios.request(config);

    return { uploadedImageUrl: result.data.imageUrl };
  }
}
