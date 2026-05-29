import { BaseEntity } from '../../../../shared/domain/model/base-entity';
import { IngredientEntity } from './ingredient.entity';

/**
 * Defines the possible states a recipe can have.
 */
export type RecipeStatus = 'ACTIVE' | 'INACTIVE' | 'LOW STOCK';

/**
 * Represents an ingredient and its required quantity for a recipe.
 */
export interface RecipeIngredient {
  ingredient: IngredientEntity;
  quantity: number;
}

/**
 * Represents a recipe within the Recipe Management domain.
 *
 * @remarks
 * This entity models the concept of a recipe that can be managed, priced, and associated with ingredients.
 * It includes properties such as the recipe's name, description, current status, SKU, pricing details, and required ingredients.
 */
export class RecipeEntity implements BaseEntity {
  /**
   * The unique identifier for the recipe
   * @defaultValue ''
   */
  private _id: string;

  /**
   * The name of the recipe
   * @defaultValue ''
   */
  private _name: string;

  /**
   * The detailed description of the recipe
   * @defaultValue ''
   */
  private _description: string;

  /**
   * The current status of the recipe
   * @defaultValue 'INACTIVE'
   */
  private _status: RecipeStatus;

  /**
   * The URL of the recipe's representative image
   * @defaultValue ''
   */
  private _imageUrl: string;

  /**
   * The stock keeping unit (SKU) identifier for the recipe
   * @defaultValue ''
   */
  private _sku: string;

  /**
   * The designated selling price for the recipe
   * @defaultValue 0
   */
  private _sellingPrice: number;

  /**
   * The calculated estimated cost to produce the recipe
   * @defaultValue 0
   */
  private _estimatedCost: number;

  /**
   * The list of ingredients required to prepare the recipe
   * @defaultValue []
   */
  private _ingredients: RecipeIngredient[];

  /**
   * Creates an instance of Recipe entity.
   *
   * @param props - Initialization properties
   * @param props.id - The unique identifier for the recipe
   * @param props.name - The name of the recipe
   * @param props.description - The description of the recipe
   * @param props.status - The current status for the recipe. It can be ACTIVE, INACTIVE, or LOW STOCK.
   * @param props.imageUrl - The URL pointing to the recipe's image
   * @param props.sku - The stock keeping unit identifier
   * @param props.sellingPrice - The final selling price of the recipe
   * @param props.estimatedCost - The estimated cost of producing the recipe
   * @param props.ingredients - The collection of ingredients required for this recipe
   */
  constructor(props: {
    id: string;
    name: string;
    description: string;
    status: RecipeStatus;
    imageUrl: string;
    sku: string;
    sellingPrice: number;
    estimatedCost: number;
    ingredients: RecipeIngredient[];
  }) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._status = props.status;
    this._imageUrl = props.imageUrl;
    this._sku = props.sku;
    this._sellingPrice = props.sellingPrice;
    this._estimatedCost = props.estimatedCost;
    this._ingredients = props.ingredients;
  }

  /**
   * Gets the unique identifier of this recipe.
   *
   * @returns The recipe's unique identifier.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets a value for the unique identifier of this recipe.
   *
   * @param value - The new value identifier for this recipe.
   */
  set id(value: string) {
    this._id = value;
  }

  /**
   * Gets the name of this recipe.
   *
   * @returns The recipe's name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Sets a value for the name of this recipe.
   *
   * @param value - The new name for this recipe.
   */
  set name(value: string) {
    this._name = value;
  }

  /**
   * Gets the description associated with this recipe.
   *
   * @returns The recipe's description.
   */
  get description(): string {
    return this._description;
  }

  /**
   * Sets a new description for this recipe.
   *
   * @param value - The new description for this recipe.
   */
  set description(value: string) {
    this._description = value;
  }

  /**
   * Gets the current status of this recipe.
   *
   * @returns The recipe's current status.
   */
  get status(): RecipeStatus {
    return this._status;
  }

  /**
   * Sets a new status for this recipe.
   *
   * @param value - The new status value for this recipe.
   */
  set status(value: RecipeStatus) {
    this._status = value;
  }

  /**
   * Gets the current image URL of this recipe.
   *
   * @returns The recipe's image URL.
   */
  get imageUrl(): string {
    return this._imageUrl;
  }

  /**
   * Sets the image URL of this recipe.
   *
   * @param value - The new value for the image URL of this recipe.
   */
  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  /**
   * Gets the SKU identifier for this recipe.
   *
   * @returns The recipe's SKU.
   */
  get sku(): string {
    return this._sku;
  }

  /**
   * Sets a new SKU identifier for this recipe.
   *
   * @param value - The new SKU identifier for this recipe.
   */
  set sku(value: string) {
    this._sku = value;
  }

  /**
   * Gets the selling price of this recipe.
   *
   * @returns The recipe's selling price.
   */
  get sellingPrice(): number {
    return this._sellingPrice;
  }

  /**
   * Sets a new selling price for this recipe.
   *
   * @param value - The new selling price for this recipe.
   */
  set sellingPrice(value: number) {
    this._sellingPrice = value;
  }

  /**
   * Gets the estimated cost of this recipe.
   *
   * @returns The recipe's estimated cost.
   */
  get estimatedCost(): number {
    return this._estimatedCost;
  }

  /**
   * Sets a new estimated cost for this recipe.
   *
   * @param value - The new estimated cost for this recipe.
   */
  set estimatedCost(value: number) {
    this._estimatedCost = value;
  }

  /**
   * Gets the list of ingredients required for this recipe.
   *
   * @returns The recipe's ingredients array.
   */
  get ingredients(): RecipeIngredient[] {
    return this._ingredients;
  }

  /**
   * Sets a new list of ingredients for this recipe.
   *
   * @param value - The new array of ingredients for this recipe.
   */
  set ingredients(value: RecipeIngredient[]) {
    this._ingredients = value;
  }
}