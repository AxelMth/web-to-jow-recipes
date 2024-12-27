import axios from 'axios';

import { Ingredient } from "../../domain/entities/ingredient";
import { Unit } from "../../domain/entities/unit";
import { IngredientRepository } from "../../application/ports/output/ingredient.repository";
// import { axiosInstance } from "../http/axios-instance";
import { ingredientSchema } from '../../presentation/schemas/jow-ingredient.schema';

export class HttpJowIngredientRepository implements IngredientRepository {
  async findByNameAndUnit(name: string, unit: Unit): Promise<Ingredient | null> {
    const response = await axios.get(
      `https://api.jow.fr/public/ingredients/search?query=${encodeURIComponent(name)}&limit=1&start=0&availabilityZoneId=FR`
    );

    const validatedIngredients = ingredientSchema.array().parse(response.data);
    
    if (validatedIngredients.length === 0) {
      return null;
    }
    
    const [ingredient] = validatedIngredients;
    const jowUnitLabel = HttpJowIngredientRepository.getJowUnitLabel(unit.name);
    
    // Find matching displayable unit and its abbreviation
    const matchingUnit = ingredient.displayableUnits.find(du => du.label === jowUnitLabel);
    
    if (!matchingUnit) {
      console.warn(`[${ingredient.name}] No matching unit found for ${unit.name} in ingredient ${ingredient.name}`);
      return null;
    }

    // Find matching abbreviation for the unit
    const abbreviation = matchingUnit.unit.abbreviations.find(
      abbr => abbr.label === jowUnitLabel
    );

    const newUnit = new Unit(
      matchingUnit.unit._id,
      matchingUnit.unit.name,
      abbreviation?.divisor || 1
    );

    return new Ingredient(
      ingredient.id,
      ingredient.name,
      ingredient.imageUrl,
      newUnit,
      1
    );
  }

  private static getJowUnitLabel(unit: string): string {
    const unitMap: Record<string, string> = {
      'cc': 'Cuillère à café',
      'cs': 'Cuillère à soupe', 
      'g': 'g',
      'ml': 'ml',
      'l': 'l',
      'kg': 'kg',
      'pièce(s)': 'Pièce',
      'paquet(s)': 'Pièce',
      'sachet(s)': 'Pièce'
    };
    return unitMap[unit.toLowerCase()] || unit;
  }
}