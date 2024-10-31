import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { NgIf } from '@angular/common';
import { passwordCheckValidator } from '../../../shared/directives/password-check.directive';
import { ErrorHandlingService } from '../../../shared/services/errorHandling.service';
import { SuccessHandlingService } from '../../../shared/services/successHandling.service';
import { SuccessComponent } from '../shared/success/success.component';
import { ErrorComponent } from '../shared/error/error.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, SuccessComponent, ErrorComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signUpForm!: FormGroup;
  success: Boolean = false;
  constructor(
    private authService: AuthService,
    private errorHandlingService: ErrorHandlingService,
    private successHandlingService: SuccessHandlingService
  ) {}
  // TODO: check if username is not taken after touched/dirty and valid
  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]),
      },
      { validators: passwordCheckValidator }
    );
  }
  get username() {
    return this.signUpForm.get('username');
  }
  get password() {
    return this.signUpForm.get('password');
  }

  onSubmit() {
    this.authService
      .signUpUser(
        this.signUpForm.value.username,
        this.signUpForm.value.password
      )
      .pipe(
        catchError(
          // TODO: check the status of err?
          this.errorHandlingService.handleError('Username is already taken.')
        )
      )
      .subscribe((res) => {
        if (res.ok) {
          this.successHandlingService.handleSuccess('Sign up successful!');
          this.success = true;
          this.signUpForm.reset();
        }
      });
  }
}
