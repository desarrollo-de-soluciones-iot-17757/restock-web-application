/**
 * Command to register a new Kit.
 * Contains the name, description, price, imageUrl, and the list of items (ingredients).
 */
export class RegisterKitCommand {
  private _name: string;
  private _description: string;
  private _price: number;
  private _imageUrl: string;
  private _items: any[]; // Lista de objetos con productId y quantity

  /**
   * Initializes a new instance of the RegisterKitCommand class.
   * @param resource - The resource containing the kit details.
   */
  constructor(resource: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    items: any[];
  }) {
    this._name = resource.name;
    this._description = resource.description;
    this._price = resource.price;
    this._imageUrl = resource.imageUrl;
    this._items = resource.items || [];
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  get items(): any[] {
    return this._items;
  }
  set items(value: any[]) {
    this._items = value;
  }
}
