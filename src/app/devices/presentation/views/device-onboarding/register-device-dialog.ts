import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DevicesStore } from '../../../application/devices.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { Device } from '../../../domain/model/device.entity';

@Component({
  selector: 'app-register-device-dialog',
  imports: [ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: './register-device-dialog.html',
  styleUrls: ['./register-device-dialog.css'],
})
export class RegisterDeviceDialog {
  private readonly devicesStore = inject(DevicesStore);
  private readonly iamStore = inject(IamStore);
  private readonly dialogRef = inject(MatDialogRef<RegisterDeviceDialog>);
  private readonly fb = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly displayModeOptions: { value: string; labelKey: string }[] = [
    {
      value: 'DISPLAY_MODE_ENVIRONMENT',
      labelKey: 'devices.registerDialog.displayModes.environment',
    },
    {
      value: 'DISPLAY_MODE_TEMPERATURE',
      labelKey: 'devices.registerDialog.displayModes.temperature',
    },
    { value: 'DISPLAY_MODE_HUMIDITY', labelKey: 'devices.registerDialog.displayModes.humidity' },
    { value: 'DISPLAY_MODE_WEIGHT', labelKey: 'devices.registerDialog.displayModes.weight' },
    {
      value: 'DISPLAY_MODE_CONVERTED_UNITS',
      labelKey: 'devices.registerDialog.displayModes.convertedUnits',
    },
  ];
  readonly form: FormGroup = this.fb.group({
    macAddress: [
      '',
      [Validators.required, Validators.pattern(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/)],
    ],
    description: ['', Validators.required],
    displayMode: ['DISPLAY_MODE_ENVIRONMENT', Validators.required],
  });

  private get accountId(): string {
    return this.iamStore.currentUser()?.accountId ?? '';
  }

  register(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { macAddress, description, displayMode } = this.form.value;
    this.devicesStore
      .createDevice({ accountId: this.accountId, macAddress, description })
      .subscribe({
        next: (device: Device) => {
          this.devicesStore.updateDisplayMode(device.id, displayMode).subscribe({
            next: (updated: Device) => this.dialogRef.close(updated),
            error: (err: { message?: string }) => {
              // Device was already created; surface the display-mode error but still close with the device.
              this.error.set(
                err?.message ??
                  this.translateService.instant('devices.registerDialog.displayModeError'),
              );
              this.loading.set(false);
              this.dialogRef.close(device);
            },
          });
        },
        error: (err: { message?: string }) => {
          this.error.set(
            err?.message ?? this.translateService.instant('devices.registerDialog.error'),
          );
          this.loading.set(false);
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
