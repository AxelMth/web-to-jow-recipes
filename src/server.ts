import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RecipeController } from './presentation/controllers/recipe.controller';
import { RecipeCrawlerService } from './application/services/recipe-crawler.service';
import { HttpSourceRecipeRepository } from './infrastructure/repositories/http-source-recipe.repository';
import { HttpJowRecipeRepository } from './infrastructure/repositories/http-jow-recipe.repository';
import { HttpJowIngredientRepository } from './infrastructure/repositories/http-jow-ingredient.repository';

export class Server {
  private app = express();
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    const sourceRepo = new HttpSourceRecipeRepository();
    const targetRepo = new HttpJowRecipeRepository();
    const ingredientsRepo = new HttpJowIngredientRepository();
    const crawlerService = new RecipeCrawlerService(
      sourceRepo,
      targetRepo,
      ingredientsRepo
    );
    const recipeController = new RecipeController(crawlerService);

    this.app.get('/health', (_: Request, res: Response) => {
      res.send({
        status: 'ok',
      });
    });
    this.app.post('/api/recipes/crawl', (req, res) =>
      recipeController.crawlRecipes(req, res)
    );
    this.app.delete('/api/recipes', (req, res) =>
      recipeController.deleteAllRecipes(req, res)
    );
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}
