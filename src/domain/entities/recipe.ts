import { Ingredient } from "./ingredient";
import { Step } from "./step";
import { Duration } from "../value-objects/duration";

export class Recipe {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ingredients: Ingredient[],
    public readonly steps: Step[],
    public readonly prepTime: Duration,
    public readonly totalTime: Duration,
    public readonly imageUrl?: string,
    public readonly servingSize?: number
  ) {}
}