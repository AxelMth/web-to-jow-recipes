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
      const validatedIngredients: Ingredient[] = [];
      
      // Validate each ingredient
      for (const ingredient of recipe.ingredients) {
        const jowIngredient = await this.ingredientRepo.findByName(ingredient.name);
        if (jowIngredient) {
          validatedIngredients.push(jowIngredient);
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
}