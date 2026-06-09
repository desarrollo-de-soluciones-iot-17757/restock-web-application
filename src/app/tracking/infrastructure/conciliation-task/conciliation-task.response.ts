export interface ConciliationTaskResponse {
  id: string;
  discrepancyId: string;
  cause: string;
  justification: string;
  resolvedAt: string;
  status: string;
  deviceId: string;
}

export interface ResolutionHistoryItemResponse {
  id: string;
  timestamp: string;
  supply: string;
  category: string;
  stockBefore: number;
  iotReading: number;
  deviation: number;
  reason: string;
}

export interface CreateConciliationTaskRequest {
  discrepancyId: string;
  cause: string;
  justification: string;
  resolvedAt: string;
}

export type ResolutionHistoryListResponse = ResolutionHistoryItemResponse[];
