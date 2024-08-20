import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../shared/auth.service';
import { NgIf } from '@angular/common';
import { passwordCheckValidator } from '../../../shared/password-check.directive';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  username: String = '';
  password: String = '';
  confirmPassword: String = '';
  signUpForm!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        username: new FormControl(this.username, [
          Validators.required,
          Validators.min(6),
          Validators.max(20),
        ]),
        password: new FormControl(this.password, [
          Validators.required,
          Validators.min(6),
          Validators.max(20),
        ]),
        confirmPassword: new FormControl(this.confirmPassword, [
          Validators.required,
          Validators.min(6),
          Validators.max(20),
        ]),
      },
      { validators: passwordCheckValidator }
    );
  }

  onSubmit() {
    this.authService.signUpUser(
      this.signUpForm.value.username,
      this.signUpForm.value.password
    );
  }
}
