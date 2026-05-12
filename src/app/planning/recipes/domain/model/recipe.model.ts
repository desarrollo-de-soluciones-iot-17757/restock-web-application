export type RecipeStatus = 'ACTIVE' | 'INACTIVE' | 'LOW STOCK';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  status: RecipeStatus;
  imageUrl: string;
  sku: string;
  sellingPrice: number;
  estimatedCost: number;
}