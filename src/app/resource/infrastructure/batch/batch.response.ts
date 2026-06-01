/**
 * Represents a batch item received from the Resource API.
 */
export interface BatchItemResponse {
  id: string;
  supplyName: string;
  subtitle: string | null;
  category: string;
  uomLabel: string;
  expirationDate: string | null;
  stock: number;
  isPerishable: boolean;
  perishableBadgeTone: 'neutral' | 'warning' | 'info';
  rowHighlight: 'warning' | null;
  minStock: number;
  maxStock: number;
}

/**
 * Represents the batch payload received from the Resource API.
 */
export interface BatchPayloadResponse {
  totalActiveBatches: number;
  totalActiveBatchesDeltaPercent: number;
  nearExpiry30Days: number;
  batches: BatchItemResponse[];
}

/**
 * Represents the root response received from the Resource API.
 */
export interface BatchRootResponse {
  batch: BatchPayloadResponse;
}
