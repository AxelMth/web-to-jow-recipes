export interface RecipeCrawlerUseCase {
  crawlAndTransform(): Promise<{
    processed: number;
    failed: number;
    errors: string[];
  }>;
  deleteAllRecipes(): Promise<void>;
}
