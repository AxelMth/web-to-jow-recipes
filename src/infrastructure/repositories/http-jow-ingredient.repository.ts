import { Ingredient } from "../../domain/entities/ingredient";
import { IngredientRepository } from "../../application/ports/output/ingredient.repository";
import { axiosInstance } from "../http/axios-instance";

export class HttpJowIngredientRepository implements IngredientRepository {
  async findByName(name: string): Promise<Ingredient | null> {
    try {
      const response = await axiosInstance.get(
        `https://api.jow.fr/public/ingredients/search?query=${encodeURIComponent(name)}&limit=1&start=0&availabilityZoneId=FR`
      );
      
      if (response.data.length === 0) {
        return null;
      }

      const ingredient = response.data[0]; // Get best match
      return new Ingredient(
        ingredient.id,
        ingredient.name,
        ingredient.imageUrl,
        ingredient.naturalUnit.name,
        1
      );
    } catch (error) {
      console.error(`Failed to find ingredient: ${name}`, error);
      return null;
    }
  }
}