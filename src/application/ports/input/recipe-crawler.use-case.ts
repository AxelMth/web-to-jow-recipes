export interface RecipeCrawlerUseCase {
  crawlAndTransform(page: number): Promise<void>;
  deleteAllRecipes(): Promise<void>;
}
