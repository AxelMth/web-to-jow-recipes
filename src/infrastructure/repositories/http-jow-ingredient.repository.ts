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

  private static defaultIngredientsMapping: Record<string, Ingredient> = {
    'Cuisse de poulet': {
      id: '5a58e2fff9828500142d5212',
      name: 'Poulet (cuisse)',
      imageUrl: 'ingredients/qOUBOU4WP6MXOQ.jpg.webp',
      unit: new Unit('598c23d414246c127285c14b', 'Pièce', 1),
      quantity: 1,
    },
    'Crème épaisse': {
      id: '6346e1439aaa5c0289da2d6f',
      name: 'Crème semi-épaisse',
      imageUrl: 'ingredients/X6saE8aOO3xqyA.png.webp',
      unit: new Unit('598c237f14246c127285c149', 'Litre', 1),
      quantity: 50,
    },
    "Gousse d'ail": {
      id: '598b5ebefd078b0011140a17',
      name: 'Ail',
      imageUrl: 'ingredients/b3FOqn5Ql1fjOQ.png.webp',
      unit: new Unit('598c23d414246c127285c14b', 'Pièce', 1),
      quantity: 1,
    },
    'Pecorino râpé': {
      id: '5d6d19e7d42034318c8f0ce2',
      name: 'Pecorino Romano',
      imageUrl: 'ingredients/j6UgEepkRuP3lg.jpg.webp',
      unit: new Unit('598c239e14246c127285c14a', 'Kilogramme', 1),
      quantity: 50,
    },
    Sucrine: {
      id: '5a649b5506e8ea0014c311c4',
      name: 'Salade (sucrine)',
      imageUrl: 'ingredients/ykXMCGLgBgUNJg.jpg.webp"',
      unit: new Unit('59aadbd4797a8c0011177854', 'Pièce', 1),
      quantity: 1,
    },
    'Dés de filet de dinde': {
      id: '64f9ba44da5a1f001198c4f5',
      name: 'Filet de dinde',
      imageUrl: 'ingredients/fNOWfKgegsYCBA.jpg.webp',
      unit: new Unit('598c239e14246c127285c14a', 'Kilogramme', 1),
      quantity: 50,
    },
  };
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
