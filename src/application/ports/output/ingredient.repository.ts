import { Unit } from '../../../domain/entities/unit';
import { Ingredient } from '../../../domain/entities/ingredient';

export interface IngredientRepository {
  findByNameAndUnit(name: string, unit: Unit): Promise<Ingredient | null>;
}
