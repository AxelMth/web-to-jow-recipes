// src/presentation/controllers/RecipeController.ts
import { Request, Response } from 'express';
import { RecipeCrawlerUseCase } from '@/application/ports/input/RecipeCrawlerUseCase';

export class RecipeController {
  constructor(private readonly recipeCrawlerUseCase: RecipeCrawlerUseCase) {}

  public async crawlRecipes(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1 } = req.query;
      await this.recipeCrawlerUseCase.crawlAndTransform(Number(page));
      res.status(200).json({ message: 'Recipes crawled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}