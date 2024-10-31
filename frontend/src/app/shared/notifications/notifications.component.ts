import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from '../../../../shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  @Input() notifications: any;
  @Output() notificationChange = new EventEmitter<any>();
  @Output() notificationDelete = new EventEmitter<any>();

  constructor() {}

  updateNotifications(notification: any) {
    this.notificationChange.emit(notification);
  }

  // TODO: accept request function (change button to accepted, say you are now friends with username)
}
