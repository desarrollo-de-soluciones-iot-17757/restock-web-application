/**
 * Response structure returned by the API when querying the complete Kits list.
 * Aligned with the real JSON array structure from Beeceptor.
 */
export interface KitResponse {
  id: string;
  name: string;
  sku?: string; // Opcional aquí porque tus kits reales en Beeceptor no tienen sku en la raíz
  price: number;
  description: string;
  imageUrl: string;
  status: string; // 'Active' | 'RESTOCK' | 'LOW_STOCK'
  items: Array<{
    id: string; // El ID del producto (ej: "P001")
    name: string; // Nombre del producto (ej: "Organic Cereal")
    sku: string; // SKU del producto (ej: "CER-ORG-01")
    price: number; // Precio unitario del producto (ej: 12.00)
    quantity: number; // Cantidad de este producto incluida en el kit
  }>;
}
