export interface RecipeCrawlerUseCase {
  crawlAndTransform(page: number): Promise<{
    processed: number;
    failed: number;
    errors: string[];
  }>;
  syncAlreadyProcessedRecipes(): Promise<void>;
  deleteAllRecipes(): Promise<void>;
}
