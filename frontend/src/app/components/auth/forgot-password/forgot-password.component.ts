import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  authData = {
    mail: '',
  };

  sendSuccess: boolean = false;

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  onSubmit(ngForm: NgForm, mailInput: any) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log(this.authData);
      ngForm.form.reset();
      this.sendSuccess = true;
    } else {
      mailInput.control.markAsTouched();
    }
  }
}
