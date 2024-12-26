import { RecipeCrawlerUseCase } from '@/application/ports/input/recipe-crawler.use-case';
import { RecipeSourceRepository } from '@/application/ports/output/recipe-source.repository';
import { RecipeTargetRepository } from '@/application/ports/output/recipe-target.repository';

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