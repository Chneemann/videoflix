import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { EmailRequestComponent } from './email-request/email-request.component';
import { PasswordRequestComponent } from './password-request/password-request.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmailRequestComponent,
    PasswordRequestComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  emailSendSuccess: boolean = false;
  passwordChangeSuccess: boolean = false;

  queryEmail: boolean = false;
  queryEmailSuccess: boolean = false;

  authData = {
    email: '',
    token: '',
    password: '',
    send: false,
  };

  queryData = {
    email: '',
    token: '',
  };

  /**
   * Initializes the ForgotPasswordComponent with ActivatedRoute, AuthService, and ErrorService.
   */
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Lifecycle hook that initializes the component.
   * Extracts query parameters and triggers email query flag if needed.
   */
  ngOnInit(): void {
    this.handleQueryParams();
  }

  submittedChangeEmail(success: boolean): void {
    this.emailSendSuccess = success;
  }

  submittedChangePassword(success: boolean): void {
    this.passwordChangeSuccess = success;
  }

  /**
   * Subscribes to query parameters and sets internal flags based on them.
   */
  private handleQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.extractAuthParams(params);
      if (this.queryData.email && this.queryData.token) {
        this.queryEmail = true;
      }
    });
  }

  /**
   * Extracts email and token from route parameters and stores them in authData.
   *
   * @param params The query parameters from the URL.
   */
  private extractAuthParams(params: Params): void {
    this.queryData.email = params['email'] || '';
    this.queryData.token = params['token'] || '';
  }

  /**
   * Validates the given email address.
   *
   * @param emailValue The email to validate.
   * @returns True if the email is valid, false otherwise.
   */
  isUserEmailValid(emailValue: string): boolean {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  /**
   * Handles form submission based on which field was used (email or password).
   *
   * @param ngForm The form group.
   * @param emailInput The input field triggering the submit.
   */
  async onSubmit(ngForm: NgForm, emailInput: any): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      try {
        if (emailInput.name === 'email') {
          await this.verifyEmail();
        } else if (emailInput.name === 'password') {
          await this.changePassword();
        }
        ngForm.form.reset();
      } catch {}
    } else {
      emailInput.control.markAsTouched();
    }
  }

  /**
   * Sends a request to start the forgot-password process.
   * Updates flags and handles errors accordingly.
   */
  private async verifyEmail(): Promise<void> {
    const body = {
      email: this.authData.email.toLowerCase(),
    };
    this.authData.send = true;
    try {
      await this.authService.forgotPassword(body);
      this.emailSendSuccess = true;
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.emailSendSuccess = false;
      this.errorService.handleError(error);
    }
  }

  /**
   * Sends a request to update the user's password using the token.
   * Updates flags and handles errors accordingly.
   */
  private async changePassword(): Promise<void> {
    const body = {
      email: this.authData.email.toLowerCase(),
      token: this.authData.token,
      new_password: this.authData.password,
    };
    this.authData.send = true;
    try {
      await this.authService.changePassword(body);
      this.queryEmail = false;
      this.queryEmailSuccess = true;
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.errorService.handleError(error);
    }
  }
}
