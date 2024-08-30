import { Component } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BtnLargeComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authData = {
    mail: '',
    password: '',
    checkbox: false,
    send: false,
    guestLogin: false,
  };

  showPassword: boolean = false;

  constructor(
    public authService: AuthService,
    public errorService: ErrorService,
    private router: Router
  ) {}

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  async guestLogin() {
    this.authData.mail = environment.guestMail;
    this.authData.password = environment.guestPassword;
    this.authData.guestLogin = true;
    const body = {
      email: environment.guestMail,
      password: environment.guestPassword,
    };
    try {
      this.authData.send = true;
      await this.authService.login(body, this.authData.checkbox);
      this.authData.mail = '';
      this.authData.password = '';
      this.authData.guestLogin = false;
      this.router.navigate(['/browse/']);
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.errorService.handleError(error);
    }
  }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = {
        email: this.authData.mail,
        password: this.authData.password,
      };
      try {
        this.authData.send = true;
        await this.authService.login(body, this.authData.checkbox);
        ngForm.resetForm();
        this.router.navigate(['/browse/']);
        this.errorService.clearError();
      } catch (error) {
        this.authData.send = false;
        this.errorService.handleError(error);
      }
    }
  }
}
