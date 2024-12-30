import axios from 'axios';
import Fuse, { FuseResult } from 'fuse.js';
import stringSimilarity from 'string-similarity';

import { Ingredient } from '../../domain/entities/ingredient';
import { Unit } from '../../domain/entities/unit';
import { IngredientRepository } from '../../application/ports/output/ingredient.repository';
import { ingredientSchema } from '../../presentation/schemas/jow-ingredient.schema';

export class HttpJowIngredientRepository implements IngredientRepository {
  private static configureFuseSearch(
    ingredients: Zod.infer<typeof ingredientSchema>[]
  ): Fuse<any> {
    return new Fuse(ingredients, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.3,
      minMatchCharLength: 4,
      findAllMatches: true,
    });
  }

  private static findBestMatch(
    searchResults: FuseResult<Zod.infer<typeof ingredientSchema>>[]
  ): Zod.infer<typeof ingredientSchema> | null {
    if (searchResults.length === 0) return null;

    // Perfect match has score 0
    const perfectMatch = searchResults.find(result => result.score === 0);
    if (perfectMatch) return perfectMatch.item;

    // Otherwise return the best scoring result
    return searchResults[0].item;
  }

  async findByNameAndUnit(
    name: string,
    unit: Unit
  ): Promise<{ ingredient: Ingredient; shouldUseUnit: boolean } | null> {
    const response = await axios.get(
      `https://api.jow.fr/public/ingredients/search?query=${encodeURIComponent(name)}&limit=10&start=0&availabilityZoneId=FR`
    );

    const validatedIngredients = ingredientSchema.array().parse(response.data);

    if (validatedIngredients.length === 0) {
      return null;
    }

    let ingredient = matchIngredient(name, validatedIngredients);

    if (!ingredient) {
      console.warn(`No ingredient found for name ${name}`);
      ingredient = validatedIngredients[0];
    }

    const jowUnitLabel = HttpJowIngredientRepository.getJowUnitLabel(unit.name);

    // Find matching displayable unit and its abbreviation
    const matchingUnit = ingredient.displayableUnits.find(
      du => du.label === jowUnitLabel
    );

    if (!matchingUnit) {
      const defaultUnitKg = ingredient.displayableUnits.find(
        du => du.label === 'kg'
      );
      if (!defaultUnitKg) {
        console.warn(`No default unit found for ingredient ${ingredient.name}`);
        return null;
      }
      return {
        ingredient: new Ingredient(
          ingredient.id,
          ingredient.name,
          ingredient.imageUrl,
          new Unit(defaultUnitKg.unit.id, defaultUnitKg.unit.name, 1000),
          50
        ),
        shouldUseUnit: true,
      };
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

    return {
      ingredient: new Ingredient(
        ingredient.id,
        ingredient.name,
        ingredient.imageUrl,
        newUnit,
        1
      ),
      shouldUseUnit: false,
    };
  }

  private static getJowUnitLabel(unit: string): string {
    const unitMap: Record<string, string> = {
      cc: 'Cuillère à café',
      cs: 'Cuillère à soupe',
      g: 'g',
      ml: 'ml',
      l: 'l',
      kg: 'kg',
      'pièce(s)': 'Pièce',
      'paquet(s)': 'Pièce',
      'sachet(s)': 'Pièce',
    };
    return unitMap[unit.toLowerCase()] || unit;
  }
}

function matchIngredient(
  ingredientName: string,
  availableIngredients: Zod.infer<typeof ingredientSchema>[],
  threshold = 0.6
): Zod.infer<typeof ingredientSchema> | null {
  // Normalize the ingredient names
  const normalizedIngredient = ingredientName.toLowerCase();
  const normalizedAvailable = availableIngredients.map(({ name }) =>
    name.toLowerCase()
  );

  // Perform fuzzy matching
  const matches = stringSimilarity.findBestMatch(
    normalizedIngredient,
    normalizedAvailable
  );

  // Check if the best match is above the threshold
  const bestMatch = matches.bestMatch;
  if (bestMatch.rating >= threshold) {
    return (
      availableIngredients.find(
        ({ name }) => name.toLowerCase() === bestMatch.target
      ) || null
    );
  }

  // No suitable match found
  return null;
}
