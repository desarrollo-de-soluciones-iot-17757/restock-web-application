import { KitItem } from './kit-item.entity';

export class Recipe {
  private _id: string;
  private _name: string;
  private _instructions: string;
  private _ingredients: KitItem[];

  constructor(resource: {
    id: string;
    name: string;
    instructions: string;
    ingredients: KitItem[];
  }) {
    this._id = resource.id;
    this._name = resource.name;
    this._instructions = resource.instructions;
    this._ingredients = resource.ingredients;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get instructions(): string {
    return this._instructions;
  }
  get ingredients(): KitItem[] {
    return this._ingredients;
  }
}
