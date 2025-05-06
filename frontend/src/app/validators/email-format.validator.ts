import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email?.toLowerCase());

    return isValid ? null : { invalidEmailFormat: true };
  };
}
