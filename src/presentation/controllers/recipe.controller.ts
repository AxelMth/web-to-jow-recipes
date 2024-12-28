import { Request, Response } from 'express';
import { RecipeCrawlerUseCase } from '../../application/ports/input/recipe-crawler.use-case';

export class RecipeController {
  constructor(private readonly recipeCrawlerUseCase: RecipeCrawlerUseCase) {}

  public async crawlRecipes(req: Request, res: Response): Promise<void> {
    try {
      await this.recipeCrawlerUseCase.crawlAndTransform();
      res.status(200).json({ message: 'Recipes crawled successfully' });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public async deleteAllRecipes(req: Request, res: Response): Promise<void> {
    try {
      await this.recipeCrawlerUseCase.deleteAllRecipes();
      res.status(200).json({ message: 'Recipes deleted successfully' });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
