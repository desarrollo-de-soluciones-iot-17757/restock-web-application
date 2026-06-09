import type { ConciliationTaskResponse, ResolutionHistoryItemResponse } from './conciliation-task.response';
import { ConciliationTask } from '../../domain/model/conciliation-task.entity';
import { Discrepancy } from '../../domain/model/discrepancy.entity';

/**
 * Assembles a conciliation task response into a domain entity.
 *
 * @param dto Conciliation task received from the API.
 * @returns A ConciliationTask domain aggregate.
 */
export function assembleConciliationTask(dto: ConciliationTaskResponse): ConciliationTask {
  const task = ConciliationTask.create(
    dto.id,
    dto.deviceId,
    Discrepancy.empty(),
  );

  if (dto.status === 'COMPLETED') {
    task.complete();
  }

  return task;
}

/**
 * Assembles a resolution history item into a UI-friendly entry.
 *
 * @param dto Resolution history item received from the API.
 * @returns A flat resolution history entry object.
 */
export function assembleResolutionHistoryEntry(dto: ResolutionHistoryItemResponse): {
  id: string;
  timestamp: string;
  supply: string;
  category: string;
  stockBefore: number;
  iotReading: number;
  deviation: number;
  reason: string;
} {
  return {
    id: dto.id,
    timestamp: dto.timestamp,
    supply: dto.supply,
    category: dto.category,
    stockBefore: dto.stockBefore,
    iotReading: dto.iotReading,
    deviation: dto.deviation,
    reason: dto.reason,
  };
}
