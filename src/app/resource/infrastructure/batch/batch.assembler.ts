import type { BatchItemResponse, BatchRootResponse } from './batch.response';

/**
 * Represents a batch row ready to be consumed by the resource screen.
 *
 * This is not a domain entity. It is an assembled read model used to display
 * batch information in the frontend.
 */
export class BatchRow {
  constructor(
    public readonly id: string,
    public readonly supplyName: string,
    public readonly subtitle: string | null,
    public readonly category: string,
    public readonly uomLabel: string,
    public readonly expirationDate: string | null,
    public readonly stock: number,
    public readonly isPerishable: boolean,
    public readonly perishableBadgeTone: 'neutral' | 'warning' | 'info',
    public readonly rowHighlight: 'warning' | null,
    public readonly minStock: number,
    public readonly maxStock: number,
  ) {}
}

/**
 * Represents assembled batch data for the resource feature.
 */
export class BatchData {
  constructor(
    public readonly totalActiveBatches: number,
    public readonly totalActiveBatchesDeltaPercent: number,
    public readonly nearExpiry30Days: number,
    public readonly batches: BatchRow[],
  ) {}
}

/**
 * Assembles a batch item response into a frontend read model row.
 *
 * @param dto Batch item received from the API.
 * @returns A batch row.
 */
function assembleRow(dto: BatchItemResponse): BatchRow {
  return new BatchRow(
    dto.id,
    dto.supplyName,
    dto.subtitle,
    dto.category,
    dto.uomLabel,
    dto.expirationDate,
    dto.stock,
    dto.isPerishable,
    dto.perishableBadgeTone,
    dto.rowHighlight,
    dto.minStock,
    dto.maxStock,
  );
}

/**
 * Assembles the batch root response into frontend-ready data.
 *
 * @param root Root response received from the API.
 * @returns Assembled batch data.
 */
export function assembleBatch(root: BatchRootResponse): BatchData {
  const payload = root.batch;

  return new BatchData(
    payload.totalActiveBatches,
    payload.totalActiveBatchesDeltaPercent,
    payload.nearExpiry30Days,
    payload.batches.map(assembleRow),
  );
}
