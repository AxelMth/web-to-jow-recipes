import { Recipe } from '../../domain/entities/recipe';
import { Ingredient } from '../../domain/entities/ingredient';
import { RecipeFilterUseCase } from '../../application/ports/input/recipe-filter.use-case';

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
  private readonly processedRecipes: Recipe[] = [];

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

  public filterAlreadyProcessedRecipes(recipes: Recipe[]): Recipe[] {
    const unprocessedRecipes: Recipe[] = [];
    for (const recipe of recipes) {
      if (!this.isRecipeProcessed(recipe)) {
        unprocessedRecipes.push(recipe);
        this.processedRecipes.push(recipe);
      }
    }
    return unprocessedRecipes;
  }

  private isRecipeProcessed(recipe: Recipe): boolean {
    return this.processedRecipes.some(
      processedRecipe => processedRecipe.name === recipe.name
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
