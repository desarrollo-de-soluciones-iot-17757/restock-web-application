import {Injectable, signal} from '@angular/core';
import {Device} from '../domain/model/device.entity';
import {DevicesApi} from '../infrastructure/devices-api';
import {RegisterDeviceCommand} from '../domain/model/register-device.command';
import {retry} from 'rxjs';

/**
 * Application service managing Device Management domain state and orchestration.
 *
 * @remarks
 * This is an application service that:
 * - Manages the state of the Device Management domain, including devices, loading status, and error messages.
 * - Orchestrates the registration of new devices with the remote system.
 * - Handles error handling and formatting for user-friendly messages.
 *
 * The store maintains the main aggregate of the domain:
 * - Devices: A list of registered devices.
 */
@Injectable({providedIn: "root"})
export class DevicesStore {

  private readonly devicesSignal = signal<Device[]>([]);

  readonly devices = this.devicesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);

  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  readonly error = this.errorSignal.asReadonly();

  constructor(private devicesApi: DevicesApi) {

  }

  /**
   * Formats error messages for display to users or logs.
   *
   * @param error - The error object to format
   * @param fallback - The fallback message if error format is unknown
   * @returns A human-readable error message
   *
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Device not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

  /**
   * Registers a new device to the store and remote system.
   *
   * @param registerDeviceCommand - The command containing the device registration data.
   */
  registerDevice(registerDeviceCommand: RegisterDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.devicesApi.registerDevice(registerDeviceCommand)
      .pipe(retry(2))
      .subscribe({
        next: registeredDevice => {
          this.devicesSignal.update(devices => [...devices, registeredDevice]);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: err => {
          this.loadingSignal.set(false);
          this.errorSignal.set(this.formatError(err, 'Failed to register device'));
        }
      });
  }
}
