import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BtnLargeComponent } from '../../shared/components/btn-large/btn-large.component';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const queryParams = { mail: this.authData.mail };
      this.router.navigate(['/register'], { queryParams });
      ngForm.form.reset();
    }
  }
}
