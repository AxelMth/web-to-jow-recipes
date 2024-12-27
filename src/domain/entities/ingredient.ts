import { Unit } from './unit';

export class Ingredient {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly imageUrl: string,
    public readonly unit: Unit,
    public readonly quantity: number
  ) {}
}