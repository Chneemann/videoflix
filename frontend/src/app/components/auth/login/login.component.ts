import { Component, ViewChild } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = {
        email: this.authData.mail,
        password: this.authData.password,
      };
      try {
        await this.authService.login(body, this.authData.checkbox);
        ngForm.resetForm();
        this.router.navigate(['/browse/']);
        this.errorService.clearError();
      } catch (error) {
        this.errorService.handleError(error);
      }
    }
  }
}
