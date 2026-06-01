 import { Supply } from './supply.entity';
import { UnitMeasure } from './unit-measure.entity';
 import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a custom supply configured by an account.
 *
 * A custom supply extends a base supply with account-specific information,
 * such as price, stock limits, image and unit of measurement.
 */
export class CustomSupply implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly name: string,
    public readonly category: string,
    private _unitPrice: number,
    public readonly supply: Supply,
    private _minStock: number,
    public readonly unit: UnitMeasure,
    private _maxStock: number,
    public readonly imgUrl: string,
  ) {
    this.validateUnitPrice(_unitPrice);
    this.validateStockLimits(_minStock, _maxStock);
  }

  /**
   * Creates a new custom supply entity.
   *
   * @param id Unique custom supply identifier.
   * @param accountId Account identifier that owns the custom supply.
   * @param name Custom supply name.
   * @param category Custom supply category.
   * @param unitPrice Unit price assigned by the account.
   * @param supply Base supply document.
   * @param minStock Minimum expected stock.
   * @param unit Unit measure document.
   * @param maxStock Maximum expected stock.
   * @param imgUrl Image URL of the custom supply.
   * @returns A new {@link CustomSupply} instance.
   */
  static create(
    id: string,
    accountId: string,
    name: string,
    category: string,
    unitPrice: number,
    supply: Supply,
    minStock: number,
    unit: UnitMeasure,
    maxStock: number,
    imgUrl: string,
  ): CustomSupply {
    return new CustomSupply(
      id,
      accountId,
      name,
      category,
      unitPrice,
      supply,
      minStock,
      unit,
      maxStock,
      imgUrl,
    );
  }

  /**
   * Creates an empty custom supply instance.
   *
   * @returns An empty {@link CustomSupply} instance.
   */
  static empty(): CustomSupply {
    return new CustomSupply('', '', '', '', 0, Supply.empty(), 0, UnitMeasure.empty(), 0, '');
  }

  /**
   * Gets the current unit price.
   *
   * @returns Unit price value.
   */
  get unitPrice(): number {
    return this._unitPrice;
  }

  /**
   * Gets the minimum stock value.
   *
   * @returns Minimum stock value.
   */
  get minStock(): number {
    return this._minStock;
  }

  /**
   * Gets the maximum stock value.
   *
   * @returns Maximum stock value.
   */
  get maxStock(): number {
    return this._maxStock;
  }

  /**
   * Checks whether the supply is perishable.
   *
   * @returns True if the base supply is perishable; otherwise, false.
   */
  isPerishable(): boolean {
    return this.supply.perishable;
  }

  /**
   * Updates the unit price.
   *
   * @param unitPrice New unit price.
   */
  updateUnitPrice(unitPrice: number): void {
    this.validateUnitPrice(unitPrice);
    this._unitPrice = unitPrice;
  }

  /**
   * Updates the stock limits.
   *
   * @param minStock New minimum stock.
   * @param maxStock New maximum stock.
   */
  updateStockLimits(minStock: number, maxStock: number): void {
    this.validateStockLimits(minStock, maxStock);
    this._minStock = minStock;
    this._maxStock = maxStock;
  }

  /**
   * Validates that the unit price is not negative.
   *
   * @param unitPrice Unit price to validate.
   * @throws Error if the unit price is negative.
   */
  private validateUnitPrice(unitPrice: number): void {
    if (unitPrice < 0) {
      throw new Error('Custom supply unit price cannot be negative.');
    }
  }

  /**
   * Validates the minimum and maximum stock limits.
   *
   * @param minStock Minimum stock value.
   * @param maxStock Maximum stock value.
   * @throws Error if stock limits are invalid.
   */
  private validateStockLimits(minStock: number, maxStock: number): void {
    if (minStock < 0 || maxStock < 0) {
      throw new Error('Stock limits cannot be negative.');
    }

    if (maxStock < minStock) {
      throw new Error('Maximum stock cannot be lower than minimum stock.');
    }
  }
}
