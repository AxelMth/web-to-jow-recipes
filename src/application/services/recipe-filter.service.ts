import { Recipe } from '../../domain/entities/recipe';
import { Ingredient } from '../../domain/entities/ingredient';
import { RecipeFilterUseCase } from '../../application/ports/input/recipe-filter.use-case';
import { readFile, appendFile } from 'node:fs/promises';

export class RecipeFilterService implements RecipeFilterUseCase {
  private readonly nonVegetarianIngredients = [
    'lardons',
    'poulet',
    'porc',
    'jambon',
    'dinde',
    'bœuf',
    'chorizo',
    'saucisse',
    'lard',
    'bacon',
    'chipolata',
  ];

  public filterRecipesByIngredients(recipes: Recipe[]): Recipe[] {
    const vegetarianRecipes: Recipe[] = [];
    for (const recipe of recipes) {
      const isVegetarian = this.isRecipeVegetarian(recipe);
      if (isVegetarian) {
        vegetarianRecipes.push(recipe);
      }
    }
    return vegetarianRecipes;
  }

  public async filterAlreadyProcessedRecipes(
    recipes: Recipe[]
  ): Promise<Recipe[]> {
    const unprocessedRecipes: Recipe[] = [];
    for (const recipe of recipes) {
      const isRecipeProcessed = await this.isRecipeProcessed(recipe);
      if (!isRecipeProcessed) {
        unprocessedRecipes.push(recipe);
        // TODO: Share filename in a constant
        await appendFile('already-processed-recipes.txt', recipe.name + '\n');
      }
    }
    return unprocessedRecipes;
  }

  private async isRecipeProcessed(recipe: Recipe): Promise<boolean> {
    const processedRecipes = await readFile(
      'already-processed-recipes.txt',
      'utf-8'
    ).then(data => data.split('\n'));
    return processedRecipes.some(
      processedRecipe => processedRecipe === recipe.name
    );
  }

  private isRecipeVegetarian(recipe: Recipe): boolean {
    for (const ingredient of recipe.ingredients) {
      if (this.isIngredientMeat(ingredient)) {
        return false;
      }
    }
    return true;
  }

  private isIngredientMeat(ingredient: Ingredient): boolean {
    const ingredientName = ingredient.name.toLowerCase();
    return this.nonVegetarianIngredients.some(
      nonVegetarianIngredient =>
        nonVegetarianIngredient.includes(ingredientName) ||
        ingredientName.includes(nonVegetarianIngredient)
    );
  }
}
