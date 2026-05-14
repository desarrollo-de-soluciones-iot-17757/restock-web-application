/**
 * Command to update an existing Kit.
 * Contains the kitId and the updated information.
 */
export class UpdateKitCommand {
  private _kitId: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _status: string;
  private _items: any[];

  /**
   * Initializes a new instance of the UpdateKitCommand class.
   * @param resource - The resource containing the updated kit details.
   */
  constructor(resource: {
    kitId: string;
    name: string;
    description: string;
    price: number;
    status: string;
    items: any[];
  }) {
    this._kitId = resource.kitId;
    this._name = resource.name;
    this._description = resource.description;
    this._price = resource.price;
    this._status = resource.status;
    this._items = resource.items || [];
  }

  get kitId(): string {
    return this._kitId;
  }
  set kitId(value: string) {
    this._kitId = value;
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

  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }

  get items(): any[] {
    return this._items;
  }
  set items(value: any[]) {
    this._items = value;
  }
}
