import { Ingredient } from "../../../domain/entities/ingredient";

export interface IngredientRepository {
  findByName(name: string): Promise<Ingredient | null>;
}