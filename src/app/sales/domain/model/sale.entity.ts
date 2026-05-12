import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Currency } from '../../../shared/domain/model/currency.entity';
import { SaleItem } from './sale-item.entity';
import { SaleTotal } from './sale-total.entity';
import { SaleStatus } from './sale-status.enum';

/**
 * Represents a sale in the sales entity.
 */
export class Sale implements BaseEntity {

  /**
   * The unique identifier of the sale.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _id: string;

  /**
   * The unique identifier of the business.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _businessId: string;

  /**
   * The unique identifier of the branch.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _branchId: string;

  /**
   * The unique identifier of the user who registered the sale.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _registeredByUserId: string;

  /**
   * The currency of the sale.
   * @private Currency is stored as a Currency object.
   */
  private _Currency: Currency;

  /**
   * The items in the sale.
   * @private SaleItems is stored as an array of SaleItem objects.
   */
  private _saleItems: SaleItem[] = [];

  /**
   * The additional supplies in the sale.
   * @private AdditionalSupplies is stored as an array of any objects.
   */
  private _additionalSupplies: any[] = [];

  /**
   * The total amount of the sale.
   * @private SaleTotal is stored as a SaleTotal object.
   */
  private _saleTotal: SaleTotal;

  /**
   * The status of the sale.
   * @private SaleStatus is stored as a SaleStatus enum.
   */
  private _saleStatus: SaleStatus;

  /**
   * The date of the sale.
   * @private Date is stored as a Date object.
   */
  private _date: Date;

  /**
   * Create a Sale
   * @param Sale - An object containing the sale's id, businessId, branchId, registeredByUserId, currency, saleItems, additionalSupplies, saleTotal, saleStatus, and date.
   */
  constructor(Sale: {
    id: string;
    businessId: string;
    branchId: string;
    registeredByUserId: string;
    currency: Currency;
    saleItems: SaleItem[];
    additionalSupplies: any[];
    saleTotal: SaleTotal;
    saleStatus: SaleStatus;
    date: Date;
  }) {
    this._id = Sale.id;
    this._businessId = Sale.businessId;
    this._branchId = Sale.branchId;
    this._registeredByUserId = Sale.registeredByUserId;
    this._Currency = Sale.currency;
    this._saleItems = Sale.saleItems;
    this._additionalSupplies = Sale.additionalSupplies;
    this._saleTotal = Sale.saleTotal;
    this._saleStatus = Sale.saleStatus;
    this._date = Sale.date;
  }

  /**
   * Getter for the sale's id.
   * @returns The sale's id.
   */
  get id(): string {
    return this.id;
  }

  /**
   * Getter for the sale's businessId.
   * @returns The sale's businessId.
   */
  get businessId() : string {
    return this._businessId;
  }

  /**
   * Getter for the sale's branchId.
   * @returns The sale's branchId.
   */
  get branchId() : string {
    return this._branchId;
  }

  /**
   * Getter for the sale's registeredByUserId.
   * @returns The sale's registeredByUserId.
   */
  get registeredByUserId() : string {
    return this._registeredByUserId;
  }

  /**
   * Getter for the sale's currency.
   * @returns The sale's currency.
   */
  get currency() : Currency {
    return this._Currency;
  }

}
