export class KitItem {
  private _productId: string;
  private _productName: string;
  private _sku: string;
  private _price: number;
  private _quantity: number;

  constructor(resource: {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }) {
    this._productId = resource.id;
    this._productName = resource.name;
    this._sku = resource.sku;
    this._price = resource.price;
    this._quantity = resource.quantity;
  }

  // Getters
  get productId(): string {
    return this._productId;
  }
  get productName(): string {
    return this._productName;
  }
  get sku(): string {
    return this._sku;
  }
  get price(): number {
    return this._price;
  }
  get quantity(): number {
    return this._quantity;
  }

  // Método útil para calcular el subtotal en la tabla del diálogo
  get subtotal(): number {
    return this._price * this._quantity;
  }
}
