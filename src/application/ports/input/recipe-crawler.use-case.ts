export interface RecipeCrawlerUseCase {
  crawlAndTransform(page: number): Promise<void>;
}