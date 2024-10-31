import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { UserService } from '../../../../shared/services/user.service';
import { Notification } from '../../../../shared/models/notification.model';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NotificationsComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  // TODO: change to proper typing
  userData!: { notifications: any[] };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // TODO: need a db listener for incoming notifications
    this.userService.getCurrentUser().subscribe((res) => {
      console.log(res);
      this.userData = res.user;
    });
  }

  onNotificationUpdate(notification: any) {
    console.log(notification);

    // TODO: api call to delete notification, then remove from array
    this.userData.notifications = [notification];
  }
}
