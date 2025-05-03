import { Component } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BtnLargeComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showPassword: boolean = false;

  authData = {
    mail: '',
    password: '',
    checkbox: false,
    send: false,
    guestLogin: false,
  };

  /**
   * Initializes the LoginComponent with Router, AuthService, and ErrorService.
   */
  constructor(
    private router: Router,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Validates the given email address.
   * Converts to lowercase before checking against the regex.
   *
   * @param emailValue The email address to validate.
   * @returns True if the email format is valid, false otherwise.
   */
  isUserEmailValid(emailValue: string): boolean {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue.toLowerCase());
  }

  /**
   * Logs the user in as a guest using predefined credentials from the environment.
   * Resets form and navigates to the main application area on success.
   *
   * @param ngForm The login form instance.
   */
  async guestLogin(ngForm: NgForm): Promise<void> {
    this.prepareGuestLoginData();
    const body = this.createLoginRequestBody(
      environment.guestMail,
      environment.guestPassword
    );

    try {
      this.authData.send = true;
      await this.authService.login(body, this.authData.checkbox);
      this.resetAuthData();
      this.router.navigate(['/browse/']);
      this.errorService.clearError();
    } catch (error) {
      this.handleLoginError(error, ngForm);
    }
  }

  /**
   * Handles standard login form submission.
   * Sends login request and navigates to the application on success.
   *
   * @param ngForm The login form instance.
   */
  async onSubmit(ngForm: NgForm): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = this.createLoginRequestBody(
        this.authData.mail,
        this.authData.password
      );

      try {
        this.authData.send = true;
        await this.authService.login(body, this.authData.checkbox);
        ngForm.resetForm();
        this.router.navigate(['/browse/']);
        this.errorService.clearError();
      } catch (error) {
        this.handleLoginError(error, ngForm);
      }
    }
  }

  /**
   * Prepares the authentication data for a guest login.
   */
  private prepareGuestLoginData(): void {
    this.authData.mail = environment.guestMail;
    this.authData.password = environment.guestPassword;
    this.authData.guestLogin = true;
  }

  /**
   * Creates the request body for the login API.
   *
   * @param email The email for the login request.
   * @param password The password for the login request.
   * @returns The body of the login request.
   */
  private createLoginRequestBody(
    email: string,
    password: string
  ): { email: string; password: string } {
    return {
      email,
      password,
    };
  }

  /**
   * Resets the authentication data after a successful login.
   */
  private resetAuthData(): void {
    this.authData.mail = '';
    this.authData.password = '';
    this.authData.guestLogin = false;
  }

  /**
   * Handles errors during login, resets form, and clears errors.
   *
   * @param error The error to handle.
   * @param ngForm The login form instance.
   */
  private handleLoginError(error: any, ngForm: NgForm): void {
    this.authData.send = false;
    this.authData.guestLogin = false;
    ngForm.reset();
    this.errorService.handleError(error);
  }
}
