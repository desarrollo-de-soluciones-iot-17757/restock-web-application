import { BaseApi } from '../../shared/infrastructure/base-api';
import { Injectable } from '@angular/core';
import { RegisterDeviceApiEndpoint } from './register-device/register-device-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { RegisterDeviceAssembler } from './register-device/register-device.assembler';
import { RegisterDeviceCommand } from '../domain/model/register-device.command';
import { Observable } from 'rxjs';
import { RegisterDeviceResource } from './register-device/register-device.response';

/**
 * Application service facade for Device Management domain API operations.
 *
 * @remarks
 * This service acts as the application layer facade coordinatinh access to Device Management domain resources through HTTP endpoints.
 *
 * Each operation is delegated to specialized endpoint clients:
 * - RegisterDevicApiEndpoint: Handles device registration operations.
 */
@Injectable({providedIn: 'root'})
export class DevicesApi extends BaseApi {

  /**
   * Endpoint client for device registration operations.
   * @private
   */
  private readonly registerDeviceEndpoint: RegisterDeviceApiEndpoint;

  /**
   * Creates an instance of DevicesApi.
   *
   * @param http - Angular HttpClient for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.registerDeviceEndpoint = new RegisterDeviceApiEndpoint(http, new RegisterDeviceAssembler());
  }

  /**
   * Registers a new device in the Device Management domain.
   *
   * @param registerDeviceCommand - Domain command containing device registration information.
   * @returns Observable stream emitting the registered device resource.
   */
  registerDevice(registerDeviceCommand: RegisterDeviceCommand): Observable<RegisterDeviceResource> {
    return this.registerDeviceEndpoint.registerDevice(registerDeviceCommand);
  }
}
