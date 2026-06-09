import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import {
  DISCREPANCY_ENDPOINT,
  DISCREPANCY_BY_ID_URL,
} from './discrepancy/discrepancy.endpoint';
import type { DiscrepancyDetailResponse, DiscrepancyItemResponse } from './discrepancy/discrepancy.response';
import { assembleDiscrepancy, assembleDiscrepancyRow } from './discrepancy/discrepancy.assembler';

import {
  CONCILIATION_TASK_ENDPOINT,
  CONCILIATION_TASK_HISTORY_URL,
} from './conciliation-task/conciliation-task.endpoint';
import type { ResolutionHistoryItemResponse } from './conciliation-task/conciliation-task.response';
import { assembleResolutionHistoryEntry } from './conciliation-task/conciliation-task.assembler';

import { TELEMETRY_ENDPOINT } from './telemetry/telemetry.endpoint';
import { assembleTelemetryReading } from './telemetry/telemetry.assembler';


import { DEVICE_HEALTH_ENDPOINT, RECALIBRATE_DEVICE_URL } from './device-health/device-health.endpoint';
import type { DeviceHealthCheckResponse } from './device-health/device-health.response';
import { assembleDeviceHealthCheck } from './device-health/device-health.assembler';
import { Discrepancy } from '../domain/model/discrepancy.entity';
import { TelemetryReading } from '../domain/model/telemetry-reading.entity';
import { DeviceHealthCheck } from '../domain/model/device-health-check.entity';


/**
 * HTTP entry point for the Tracking bounded context.
 *
 * Centralises access to discrepancy, conciliation task, telemetry,
 * and device health data from the backend APIs.
 */
@Injectable({ providedIn: 'root' })
export class TrackingApi {
  private readonly http = inject(HttpClient);

  /**
   * Loads discrepancy list items.
   *
   * @param params Optional query parameters.
   * @returns An observable with assembled discrepancy rows.
   */
  getDiscrepancies(params?: HttpParams): Observable<ReturnType<typeof assembleDiscrepancyRow>[]> {
    return this.http
      .get<DiscrepancyItemResponse[]>(DISCREPANCY_ENDPOINT, { params })
      .pipe(map((items) => items.map(assembleDiscrepancyRow)));
  }

  /**
   * Loads a single discrepancy by its identifier.
   *
   * @param id The discrepancy identifier.
   * @returns An observable with the domain entity.
   */
  getDiscrepancyById(id: string): Observable<Discrepancy> {
    return this.http
      .get<DiscrepancyDetailResponse>(DISCREPANCY_BY_ID_URL(id))
      .pipe(map(assembleDiscrepancy));
  }

  /**
   * Creates a conciliation task to resolve a discrepancy.
   *
   * @param body The conciliation task request payload.
   * @returns An observable that completes when the task is created.
   */
  createConciliationTask(body: {
    discrepancyId: string;
    cause: string;
    justification: string;
    resolvedAt: string;
  }): Observable<void> {
    return this.http.post<void>(CONCILIATION_TASK_ENDPOINT, body);
  }

  /**
   * Loads resolution history entries.
   *
   * @param params Optional query parameters.
   * @returns An observable with assembled history entries.
   */
  getResolutionHistory(params?: HttpParams): Observable<ReturnType<typeof assembleResolutionHistoryEntry>[]> {
    return this.http
      .get<ResolutionHistoryItemResponse[]>(CONCILIATION_TASK_HISTORY_URL, { params })
      .pipe(map((items) => items.map(assembleResolutionHistoryEntry)));
  }

  /**
   * Loads telemetry readings for a given device.
   *
   * @param deviceId The device identifier.
   * @returns An observable with telemetry domain entities.
   */
  getTelemetryReadings(deviceId: string): Observable<TelemetryReading[]> {
    const params = new HttpParams().set('deviceId', deviceId);

    return this.http
      .get<any[]>(TELEMETRY_ENDPOINT, { params })
      .pipe(map((items) => items.map(assembleTelemetryReading)));
  }

  /**
   * Loads device health checks for a given device.
   *
   * @param deviceId The device identifier.
   * @returns An observable with device health domain entities.
   */
  getDeviceHealthChecks(deviceId: string): Observable<DeviceHealthCheck[]> {
    const params = new HttpParams().set('deviceId', deviceId);

    return this.http
      .get<DeviceHealthCheckResponse[]>(DEVICE_HEALTH_ENDPOINT, { params })
      .pipe(map((items) => items.map(assembleDeviceHealthCheck)));
  }

  /**
   * Sends a recalibration request for a device.
   *
   * @param deviceId The device identifier.
   * @param action The calibration action.
   * @param note Optional note for the recalibration.
   * @returns An observable that completes when recalibration is requested.
   */
  recalibrateDevice(deviceId: string, action: string, note: string): Observable<void> {
    return this.http.post<void>(RECALIBRATE_DEVICE_URL(deviceId), { action, note });
  }
}
