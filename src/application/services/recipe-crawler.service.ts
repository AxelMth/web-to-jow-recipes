import { RecipeCrawlerUseCase } from '../../application/ports/input/recipe-crawler.use-case';
import { RecipeSourceRepository } from '../../application/ports/output/recipe-source.repository';
import { RecipeTargetRepository } from '../../application/ports/output/recipe-target.repository';
import { IngredientRepository } from '../../application/ports/output/ingredient.repository';
import { Recipe } from '../../domain/entities/recipe';
import { Ingredient } from '../../domain/entities/ingredient';

export class RecipeCrawlerService implements RecipeCrawlerUseCase {
  constructor(
    private readonly sourceRepo: RecipeSourceRepository,
    private readonly targetRepo: RecipeTargetRepository,
    private readonly ingredientRepo: IngredientRepository
  ) {}

  async crawlAndTransform(): Promise<{
    processed: number;
    failed: number;
    errors: string[];
  }> {
    let page = 1;
    const itemsPerPage = 10;

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      let hasNextPage = true;
      while (hasNextPage) {
        console.log(`Fetching page ${page}...`);
        const { recipes, pagination } =
          await this.sourceRepo.fetchPaginatedRecipes(page, itemsPerPage);

        for (let recipe of recipes) {
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

        hasNextPage = pagination.totalItems > page * itemsPerPage;
        page++;
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
