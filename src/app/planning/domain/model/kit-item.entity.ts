/**
 * Represents an item within a Kit or Recipe.
 */
export class KitItem {
  private _productId: string;
  private _productName: string;
  private _sku: string;
  private _quantityPerKit: string;
  private _currentStock: number;

  constructor(resource: {
    productId: string;
    productName: string;
    sku: string;
    quantityPerKit: string;
    currentStock: number;
  }) {
    this._productId = resource.productId;
    this._productName = resource.productName;
    this._sku = resource.sku;
    this._quantityPerKit = resource.quantityPerKit;
    this._currentStock = resource.currentStock;
  }

  get productId(): string {
    return this._productId;
  }
  get productName(): string {
    return this._productName;
  }
  get sku(): string {
    return this._sku;
  }
  get quantityPerKit(): string {
    return this._quantityPerKit;
  }
  get currentStock(): number {
    return this._currentStock;
  }
}
