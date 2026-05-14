import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * KitResource
 * Represents a single kit record in the catalog.
 */
export interface KitResource extends BaseResource {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
  items: KitItemResource[];
}

/**
 * KitItemResource
 * Represents a product/supply included in a kit.
 */
export interface KitItemResource {
  productId: string;
  productName: string;
  sku: string;
  quantityPerKit: string;
  currentStock: number;
}

/**
 * KitsResponse
 * Represents the response returned by the get kits endpoint.
 */
export interface KitsResponse extends BaseResponse, KitResource {
  kits: KitResource[];
}
