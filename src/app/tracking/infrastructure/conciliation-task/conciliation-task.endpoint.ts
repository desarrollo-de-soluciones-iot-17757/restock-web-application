import { environment } from '../../../../environments/environment';

const BASE = `${environment.platformProviderApiBaseUrl}/conciliation-tasks`;

export const CONCILIATION_TASK_ENDPOINT = BASE;
export const CONCILIATION_TASK_HISTORY_URL = `${BASE}/history`;
export const CREATE_CONCILIATION_TASK_URL = BASE;
