// update-kit.request.ts
export interface UpdateKitRequest {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  items: Array<{ productId: string; quantity: number }>;
}
