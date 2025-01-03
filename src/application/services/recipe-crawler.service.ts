import { RecipeCrawlerUseCase } from '../../application/ports/input/recipe-crawler.use-case';
import { RecipeSourceRepository } from '../../application/ports/output/recipe-source.repository';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { IngredientRepository } from '../../application/ports/output/ingredient.repository';
import { Recipe } from '../../domain/entities/recipe';
import { Ingredient } from '../../domain/entities/ingredient';
import { RecipeFilterUseCase } from '../ports/input/recipe-filter.use-case';
import { appendFile, writeFile } from 'node:fs/promises';

export class RecipeCrawlerService implements RecipeCrawlerUseCase {
  constructor(
    private readonly recipeService: RecipeFilterUseCase,
    private readonly sourceRepo: RecipeSourceRepository,
    private readonly targetRepo: RecipeTargetRepository,
    private readonly ingredientRepo: IngredientRepository
  ) {}

  async crawlAndTransform(page: number = 1): Promise<{
    processed: number;
    failed: number;
    errors: string[];
  }> {
    let currentPage = page;
    const itemsPerPage = 10;

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      let hasNextPage = true;
      while (hasNextPage) {
        console.log(`Fetching page ${currentPage}...`);
        const { recipes, pagination } =
          await this.sourceRepo.fetchPaginatedRecipes(
            currentPage,
            itemsPerPage
          );

        const vegetarianRecipes =
          this.recipeService.filterRecipesByIngredients(recipes);
        const unprocessedAndVegetarianRecipes =
          await this.recipeService.filterAlreadyProcessedRecipes(
            vegetarianRecipes
          );

        for (let recipe of unprocessedAndVegetarianRecipes) {
          console.log(`Crawling recipe ${recipe.name}...`);

          if (recipe.imageUrl) {
            const { uploadedImageUrl } = await this.targetRepo.uploadImage(
              recipe.imageUrl
            );
            recipe = this.getRecipeWithImage(recipe, uploadedImageUrl);
          }

          const validatedRecipe = await this.getRecipeWithIngredients(recipe);

          await this.targetRepo.saveRecipe(validatedRecipe);

          processed++;
        }

        hasNextPage = pagination.totalItems > currentPage * itemsPerPage;
        currentPage++;
      }
    } catch (error: unknown) {
      console.error(error);
      failed++;
      if (error instanceof Error) {
        errors.push(error.message);
      }
    }

    return { processed, failed, errors };
  }

  async syncAlreadyProcessedRecipes(): Promise<void> {
    const recipes = await this.targetRepo.getAllRecipes();
    for (const recipe of recipes) {
      // TODO: Share filename in a constant
      await appendFile('already-processed-recipes.txt', recipe.name + '\n');
    }
  }

  async deleteAllRecipes(): Promise<void> {
    const recipes = await this.targetRepo.getAllRecipes();
    for (const recipe of recipes) {
      await this.targetRepo.deleteRecipeById(recipe.id);
    }
  }

  private async getRecipeWithIngredients(recipe: Recipe): Promise<Recipe> {
    const validatedIngredients: Ingredient[] = [];

    // Validate each ingredient
    for (const ingredient of recipe.ingredients) {
      const result = await this.ingredientRepo.findByNameAndUnit(
        ingredient.name,
        ingredient.unit
      );
      if (result) {
        const { ingredient: jowIngredient, shouldUseUnit } = result;
        // Create new ingredient instance preserving quantity and unit
        const validatedIngredient = new Ingredient(
          jowIngredient.id,
          jowIngredient.name,
          jowIngredient.imageUrl,
          jowIngredient.unit,
          (shouldUseUnit ? jowIngredient.quantity : ingredient.quantity) /
            jowIngredient.unit.divisor
        );
        validatedIngredients.push(validatedIngredient);
      }
    }

    if (validatedIngredients.length > 0) {
      // Create new recipe with validated ingredients
      const validatedRecipe = new Recipe(
        recipe.id,
        recipe.name,
        validatedIngredients,
        recipe.steps,
        recipe.prepTime,
        recipe.totalTime,
        recipe.imageUrl,
        recipe.servingSize
      );

      return validatedRecipe;
    }

    return recipe;
  }

  private getRecipeWithImage(recipe: Recipe, imageUrl: string): Recipe {
    return new Recipe(
      recipe.id,
      recipe.name,
      recipe.ingredients,
      recipe.steps,
      recipe.prepTime,
      recipe.totalTime,
      imageUrl,
      recipe.servingSize
    );
  }
}
