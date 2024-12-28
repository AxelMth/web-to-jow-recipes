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

  async crawlAndTransform(page: number): Promise<void> {
    const recipes = await this.sourceRepo.fetchPaginatedRecipes(page);

    for (const recipe of recipes) {
      console.log(`Crawling recipe ${recipe.name}...`);

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

        await this.targetRepo.saveRecipe(validatedRecipe);
      }
    }
  }

  async deleteAllRecipes(): Promise<void> {
    const recipes = await this.targetRepo.getAllRecipes();
    for (const recipe of recipes) {
      await this.targetRepo.deleteRecipeById(recipe.id);
    }
  }
}
