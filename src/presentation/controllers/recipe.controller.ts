import { Request, Response } from 'express';
import { RecipeCrawlerUseCase } from '../../application/ports/input/recipe-crawler.use-case';
import { fail } from 'node:assert';

export class RecipeController {
  constructor(private readonly recipeCrawlerUseCase: RecipeCrawlerUseCase) {}

  public async crawlRecipes(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const { processed, failed, errors } =
        await this.recipeCrawlerUseCase.crawlAndTransform(page);
      res.status(200).json({
        processed,
        failed,
        ...(failed > 0 && { errors }),
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  public async syncRecipes(req: Request, res: Response): Promise<void> {
    try {
      await this.recipeCrawlerUseCase.syncAlreadyProcessedRecipes();
      res.status(200).json({ message: 'Recipes synced successfully' });
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
