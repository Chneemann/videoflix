import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../services/error.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  authData = {
    mail: '',
    send: false,
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
      this.authData.send = true;
      await this.authService.checkAuthUserMail(body);
      const queryParams = { mail: this.authData.mail };
      this.router.navigate(['/register'], { queryParams });
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.errorService.handleError(error);
    }
  }
}
