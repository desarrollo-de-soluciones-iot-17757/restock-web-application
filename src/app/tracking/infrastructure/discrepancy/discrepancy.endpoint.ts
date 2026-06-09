import { environment } from '../../../../environments/environment';

const BASE = `${environment.platformProviderApiBaseUrl}/discrepancies`;

export const DISCREPANCY_ENDPOINT = BASE;
export const DISCREPANCY_BY_ID_URL = (id: string) => `${BASE}/${encodeURIComponent(id)}`;
