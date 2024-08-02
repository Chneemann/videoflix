import { Component } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [BtnLargeComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authData = {
    mail: '',
    password: '',
    passwordConfirm: '',
  };

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log(this.authData.mail);
      this.authData.mail = '';
    }
  }
}
