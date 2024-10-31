import { Component } from '@angular/core';
import { SuccessHandlingService } from '../../../../shared/services/successHandling.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  public successMessage = '';

  constructor(private successHandlingService: SuccessHandlingService) {}
  public ngOnInit() {
    this.successHandlingService.notification.subscribe({
      next: (notification) => {
        if (notification) {
          this.successMessage = notification;
        }
      },
    });
  }
}
