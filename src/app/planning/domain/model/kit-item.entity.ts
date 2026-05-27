import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Entity representing an item/component inside a Kit aggregate.
 * Cloned directly from the service definitions (Beeceptor).
 */
export class KitItem implements BaseEntity {
  private readonly _id: string; // Mapea con el "id" del producto (ej: "P001")
  private readonly _name: string; // Mapea con "name"
  private readonly _sku: string; // Mapea con "sku"
  private readonly _price: number; // Mapea con "price" (útil para calcular costos totales)
  private _quantity: number; // Mapea con "quantity" (el valor mutable que agregas al kit)

  /**
   * Initializes a new KitItem instance from endpoint data.
   */
  constructor(params: { id: string; name: string; sku: string; price: number; quantity: number }) {
    // Regla de negocio inquebrantable en tu dominio
    if (params.quantity <= 0) {
      throw new Error('La cantidad del producto debe ser mayor a cero.');
    }

    this._id = params.id;
    this._name = params.name;
    this._sku = params.sku;
    this._price = params.price;
    this._quantity = params.quantity;
  }

  // --- GETTERS DIRECTOS ---

  get id(): string {
    return this._id;
  }

  // Cumple con la interfaz BaseEntity de tu arquitectura usando el ID del producto
  get productId(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
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

  // --- LÓGICA DE DOMINIO ---

  /**
   * Cambia la cantidad elegida dentro del selector o la tabla del modal.
   */
  changeQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('La cantidad del componente debe ser mayor a cero.');
    }
    this._quantity = newQuantity;
  }

  get subtotal(): number {
    return this._price * this._quantity;
  }
}
