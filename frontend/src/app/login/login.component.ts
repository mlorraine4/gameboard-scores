import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.authService.loginUser(
      this.loginForm.value.username,
      this.loginForm.value.password
    );
  }
}
