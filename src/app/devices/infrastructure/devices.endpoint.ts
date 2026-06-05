import { environment } from '../../../environments/environment';

const DEVICES_BASE = `${environment.platformProviderApiBaseUrl}/devices`;
const THRESHOLDS_BASE = `${environment.platformProviderApiBaseUrl}/device-thresholds`;
const DEVICES_DEV_PROXY_BASE = '/api/v1/devices';

export const DEVICES_BY_ACCOUNT_URL = (accountId: string) =>
  `${DEVICES_BASE}?accountId=${accountId}`;
export const DEVICE_BY_ID_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}`;
export const CREATE_DEVICE_URL = (accountId: string) =>
  `${DEVICES_BASE}?accountId=${accountId}`;
export const ADD_SPECIFICATIONS_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/specifications`;
export const ASSIGN_BRANCH_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/branch`;
export const ASSIGN_BATCH_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/batch`;
export const ASSIGN_THRESHOLD_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/threshold`;
export const UPDATE_MEASUREMENT_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/measurement`;
export const CONFIRM_CONFIGURATION_URL = (deviceId: string) =>
  `${environment.production ? DEVICES_BASE : DEVICES_DEV_PROXY_BASE}/${deviceId}/configuration/confirm`;
export const UPDATE_WITHDRAWN_STOCK_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/withdrawn-stock`;
export const DEACTIVATE_DEVICE_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/deactivate`;

export const THRESHOLDS_BY_ACCOUNT_URL = (accountId: string) =>
  `${THRESHOLDS_BASE}?accountId=${accountId}`;
export const CREATE_THRESHOLD_URL = (accountId: string) =>
  `${THRESHOLDS_BASE}?accountId=${accountId}`;
export const THRESHOLD_BY_ID_URL = (thresholdId: string) =>
  `${THRESHOLDS_BASE}/${thresholdId}`;
