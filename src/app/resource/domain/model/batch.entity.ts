 import { CustomSupply } from './custom-supply.entity';
 import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an inventory batch associated with a custom supply.
 *
 * A batch stores the current quantity available in a specific branch and may
 * include an expiration date when the related supply is perishable.
 */
export class Batch implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly customSupplyId: string,
    public readonly branchId: string,
    private _currentQuantity: number,
    public readonly expirationDate: string | null,
    public readonly accountId: string,
    public readonly customSupply?: CustomSupply,
  ) {
    this.validateCurrentQuantity(_currentQuantity);
  }

  /**
   * Creates a new batch entity.
   *
   * @param id Unique batch identifier.
   * @param customSupplyId Identifier of the related custom supply.
   * @param branchId Identifier of the branch where the batch is stored.
   * @param currentQuantity Current available quantity.
   * @param expirationDate Optional expiration date.
   * @param accountId Account identifier that owns the batch.
   * @param customSupply Optional custom supply entity.
   * @returns A new {@link Batch} instance.
   */
  static create(
    id: string,
    customSupplyId: string,
    branchId: string,
    currentQuantity: number,
    expirationDate: string | null,
    accountId: string,
    customSupply?: CustomSupply,
  ): Batch {
    return new Batch(
      id,
      customSupplyId,
      branchId,
      currentQuantity,
      expirationDate,
      accountId,
      customSupply,
    );
  }

  /**
   * Creates an empty batch instance.
   *
   * This is useful for initializing forms before data is loaded.
   *
   * @returns An empty {@link Batch} instance.
   */
  static empty(): Batch {
    return new Batch('', '', '', 0, null, '');
  }

  /**
   * Gets the current quantity of the batch.
   *
   * @returns Current quantity value.
   */
  get currentQuantity(): number {
    return this._currentQuantity;
  }

  /**
   * Updates the current quantity of the batch.
   *
   * @param quantity New quantity value.
   */
  updateCurrentQuantity(quantity: number): void {
    this.validateCurrentQuantity(quantity);
    this._currentQuantity = quantity;
  }

  /**
   * Checks whether the batch has already expired.
   *
   * @returns True if the batch is expired; otherwise, false.
   */
  isExpired(): boolean {
    if (!this.expirationDate) return false;

    const expirationDate = new Date(this.expirationDate);
    const today = new Date();

    expirationDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return expirationDate < today;
  }

  /**
   * Checks whether the batch belongs to a perishable custom supply.
   *
   * @returns True if the custom supply is perishable; otherwise, false.
   */
  isPerishable(): boolean {
    return this.customSupply?.isPerishable() ?? false;
  }

  /**
   * Validates that the current quantity is not negative.
   *
   * @param quantity Quantity to validate.
   * @throws Error if the quantity is negative.
   */
  private validateCurrentQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Batch current quantity cannot be negative.');
    }
  }
}
