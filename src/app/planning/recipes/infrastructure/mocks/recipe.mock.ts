import { Recipe } from '../../domain/model/recipe.model';

export const RECIPES_MOCK: Recipe[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef burger with cheddar cheese and signature sauce.',
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    sku: 'BG-1001',
    sellingPrice: 18.5,
    estimatedCost: 9.25
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Wood-fired pizza with mozzarella and premium pepperoni.',
    status: 'LOW STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    sku: 'PZ-2031',
    sellingPrice: 35,
    estimatedCost: 16
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh lettuce with parmesan and homemade dressing.',
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    sku: 'SL-3302',
    sellingPrice: 14,
    estimatedCost: 6
  }
];