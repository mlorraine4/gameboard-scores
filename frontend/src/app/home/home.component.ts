import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FAKE_API } from '../../../shared/constants/urls';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private http: HttpClient, private authService: AuthService) {}

  onSubmit() {
    console.log(this.authService.getIsAuthenticated());
    console.log('submitting');
    this.http.get(FAKE_API).subscribe((res) => {
      console.log(res);
    });
  }
}
