import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { KitItem } from './kit-item.entity';

export class Kit implements BaseEntity {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _imageUrl: string;
  private _status: string;
  private _items: KitItem[];

  constructor(resource: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    status: string;
    items: KitItem[];
  }) {
    this._id = resource.id;
    this._name = resource.name;
    this._description = resource.description;
    this._price = resource.price;
    this._imageUrl = resource.imageUrl;
    this._status = resource.status;
    this._items = resource.items;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
  }
  get price(): number {
    return this._price;
  }
  get imageUrl(): string {
    return this._imageUrl;
  }
  get status(): string {
    return this._status;
  }
  get items(): KitItem[] {
    return this._items;
  }
}
