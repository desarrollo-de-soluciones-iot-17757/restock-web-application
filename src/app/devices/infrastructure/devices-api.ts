import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Device } from '../domain/model/device.entity';
import { DeviceThreshold } from '../domain/model/device-threshold.entity';
import { DevicesApiEndpoint, AddSpecificationsRequest, UpdateMeasurementRequest } from './devices-api-endpoint';
import { DeviceThresholdApiEndpoint } from './device-threshold/device-threshold-api-endpoint';
import { CreateDeviceThresholdRequest } from './device-threshold/device-threshold.response';

@Injectable({ providedIn: 'root' })
export class DevicesApi extends BaseApi {
  private readonly devicesEndpoint: DevicesApiEndpoint;
  private readonly thresholdsEndpoint: DeviceThresholdApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.devicesEndpoint = new DevicesApiEndpoint(http);
    this.thresholdsEndpoint = new DeviceThresholdApiEndpoint(http);
  }

  // --- Device queries ---

  getDevicesByAccountId(accountId: string): Observable<Device[]> {
    return this.devicesEndpoint.getDevicesByAccountId(accountId);
  }

  getDeviceById(deviceId: string): Observable<Device> {
    return this.devicesEndpoint.getById(deviceId);
  }

  // --- Device onboarding steps ---

  createDevice(accountId: string, body: { macAddress: string; description: string }): Observable<Device> {
    return this.devicesEndpoint.createDevice(accountId, body);
  }

  addSpecifications(deviceId: string, body: AddSpecificationsRequest): Observable<Device> {
    return this.devicesEndpoint.addSpecifications(deviceId, body);
  }

  assignBranch(deviceId: string, branchId: string): Observable<Device> {
    return this.devicesEndpoint.assignBranch(deviceId, branchId);
  }

  assignBatch(deviceId: string, batchId: string): Observable<Device> {
    return this.devicesEndpoint.assignBatch(deviceId, batchId);
  }

  assignThreshold(deviceId: string, supplyThresholdId: string): Observable<Device> {
    return this.devicesEndpoint.assignThreshold(deviceId, supplyThresholdId);
  }

  updateMeasurement(deviceId: string, body: UpdateMeasurementRequest): Observable<Device> {
    return this.devicesEndpoint.updateMeasurement(deviceId, body);
  }

  confirmConfiguration(deviceId: string): Observable<Device> {
    return this.devicesEndpoint.confirmConfiguration(deviceId);
  }

  // --- Device operations ---

  updateWithdrawnStock(deviceId: string, amount: number): Observable<Device> {
    return this.devicesEndpoint.updateWithdrawnStock(deviceId, amount);
  }

  deactivate(deviceId: string): Observable<Device> {
    return this.devicesEndpoint.deactivate(deviceId);
  }

  // --- Threshold queries & mutations ---

  getThresholdsByAccountId(accountId: string): Observable<DeviceThreshold[]> {
    return this.thresholdsEndpoint.getThresholdsByAccountId(accountId);
  }

  getThresholdById(thresholdId: string): Observable<DeviceThreshold> {
    return this.thresholdsEndpoint.getThresholdById(thresholdId);
  }

  createThreshold(accountId: string, body: CreateDeviceThresholdRequest): Observable<DeviceThreshold> {
    return this.thresholdsEndpoint.createThreshold(accountId, body);
  }
}
