import {
  AlertSeverity,
  AlertSourceType,
  AlertStatus,
  DeviceAlert,
} from '../../domain/model/notification.entity';
import { NotificationResource } from './notifications.response';

export class NotificationsAssembler {
  static inferAlertType(resource: NotificationResource): string {
    const sourceType = resource.sourceType?.toUpperCase() ?? '';

    switch (sourceType) {
      case 'MANUAL':
      case 'TRANSFER':
      case 'INVENTORY':
        return 'MANUAL_TRANSFER';
      case 'DISCREPANCY':
        return 'STOCK_WARNING';
      case 'DEVICE':
        return 'DEVICE_REGISTERED';
      default:
        return 'STOCK_WARNING';
    }
  }

  static mapStatus(status: string): string {
    if (status === 'UNREAD')       return 'ACTIVE';
    if (status === 'READ')         return 'ACKNOWLEDGED';
    if (status === 'ACKNOWLEDGED') return 'ACKNOWLEDGED';
    if (status === 'RESOLVED')     return 'RESOLVED';
    return 'ACTIVE';
  }

  static toEntity(resource: NotificationResource): DeviceAlert {
    console.log('[NotificationsAssembler] mapping notification:', resource.id, resource.title, resource.sourceType);
    return DeviceAlert.create({
      id:           resource.id,
      title:        resource.title,
      message:      resource.message,
      severity:     resource.severity,
      status:       NotificationsAssembler.mapStatus(resource.status),
      sourceType:   resource.sourceType,
      alertType:    NotificationsAssembler.inferAlertType(resource),
      timestamp:    resource.timestamp,
    });
  }

  static toEntityList(resources: NotificationResource[]): DeviceAlert[] {
    return resources.map(r => NotificationsAssembler.toEntity(r));
  }
}
