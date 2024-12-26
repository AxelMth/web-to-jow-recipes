// src/application/services/RecipeCrawlerService.ts
import { RecipeCrawlerUseCase } from '@/application/ports/input/RecipeCrawlerUseCase';
import { RecipeSourceRepository } from '@/application/ports/output/RecipeSourceRepository';
import { RecipeTargetRepository } from '@/application/ports/output/RecipeTargetRepository';

export class RecipeCrawlerService implements RecipeCrawlerUseCase {
  constructor(
    private readonly sourceRepo: RecipeSourceRepository,
    private readonly targetRepo: RecipeTargetRepository
  ) {}

  async crawlAndTransform(page: number): Promise<void> {
    const recipes = await this.sourceRepo.fetchPaginatedRecipes(page);
    for (const recipe of recipes) {
      await this.targetRepo.saveRecipe(recipe);
    }
  }
}