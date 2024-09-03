import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

export const passwordCheckValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Validation passes if password and confirm password match
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordsDoNotMatch: true }
    : null;
};

@Directive({
  selector: '[appPasswordCheck]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordCheckValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordCheckValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return passwordCheckValidator(control);
  }
}
