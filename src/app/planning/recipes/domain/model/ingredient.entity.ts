import { BaseEntity } from '../../../../shared/domain/model/base-entity';

/**
 * Represents an ingredient within the Recipe Management domain.
 *
 * @remarks
 * This entity models the concept of a raw material or item used to create recipes.
 * It includes properties such as the ingredient's unique identifier, name, unit price, and unit of measurement.
 */
export class IngredientEntity implements BaseEntity {
  /**
   * The unique identifier for the ingredient
   * @defaultValue ''
   */
  private _id: string;

  /**
   * The name of the ingredient
   * @defaultValue ''
   */
  private _name: string;

  /**
   * The price per single unit of the ingredient
   * @defaultValue 0
   */
  private _unitPrice: number;

  /**
   * The unit of measurement used for this ingredient (e.g., kg, liters, units)
   * @defaultValue ''
   */
  private _unitMeasure: string;

  /**
   * Creates an instance of Ingredient entity.
   *
   * @param props - Initialization properties
   * @param props.id - The unique identifier for the ingredient
   * @param props.name - The name of the ingredient
   * @param props.unitPrice - The monetary cost per single unit of measure
   * @param props.unitMeasure - The standard unit of measurement (e.g., 'grams', 'ml', 'pieces')
   */
  constructor(props: {
    id: string;
    name: string;
    unitPrice: number;
    unitMeasure: string;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._unitPrice = props.unitPrice;
    this._unitMeasure = props.unitMeasure;
  }

  /**
   * Gets the unique identifier of this ingredient.
   *
   * @returns The ingredient's unique identifier.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets a value for the unique identifier of this ingredient.
   *
   * @param value - The new value identifier for this ingredient.
   */
  set id(value: string) {
    this._id = value;
  }

  /**
   * Gets the name of this ingredient.
   *
   * @returns The ingredient's name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets a value for the name of this ingredient.
   *
   * @param value - The new name for this ingredient.
   */
  set name(value: string) {
    this._name = value;
  }

  /**
   * Gets the unit price of this ingredient.
   *
   * @returns The ingredient's unit price.
   */
  get unitPrice(): number {
    return this._unitPrice;
  }

  /**
   * Sets a new unit price for this ingredient.
   *
   * @param value - The new unit price for this ingredient.
   */
  set unitPrice(value: number) {
    this._unitPrice = value;
  }

  /**
   * Gets the unit of measurement for this ingredient.
   *
   * @returns The ingredient's unit of measurement.
   */
  get unitMeasure(): string {
    return this._unitMeasure;
  }

  /**
   * Sets a new unit of measurement for this ingredient.
   *
   * @param value - The new unit of measurement for this ingredient.
   */
  set unitMeasure(value: string) {
    this._unitMeasure = value;
  }
}