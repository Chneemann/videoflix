import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BtnLargeComponent } from '../../shared/components/btn-large/btn-large.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [BtnLargeComponent, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authData = {
    mail: '',
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
