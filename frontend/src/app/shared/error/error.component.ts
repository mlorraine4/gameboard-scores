import { Component, OnInit } from '@angular/core';
import { ErrorHandlingService } from '../../../../shared/services/errorHandling.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent implements OnInit {
  public errorMessage = '';

  constructor(private errorHandlingService: ErrorHandlingService) {}
  public ngOnInit() {
    this.errorHandlingService.notification.subscribe({
      next: (notification) => {
        if (notification) {
          this.errorMessage = notification;
        }
      },
    });
  }
}
