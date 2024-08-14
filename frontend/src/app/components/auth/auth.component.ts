import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BtnLargeComponent } from '../../shared/components/buttons/btn-large/btn-large.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../services/error.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authData = {
    mail: '',
  };
  constructor(
    private router: Router,
    public errorService: ErrorService,
    private authService: AuthService
  ) {}

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  async onSubmit(ngForm: NgForm, mailInput: any) {
    if (ngForm.submitted && ngForm.form.valid) {
      await this.checkDuplicatesEmail();
    } else {
      mailInput.control.markAsTouched();
    }
  }

  async checkDuplicatesEmail() {
    const body = {
      email: this.authData.mail,
    };
    try {
      await this.authService.checkAuthUserMail(body);
      const queryParams = { mail: this.authData.mail };
      this.router.navigate(['/register'], { queryParams });
      this.errorService.clearError();
    } catch (error) {
      this.errorService.handleError(error);
    }
  }
}
