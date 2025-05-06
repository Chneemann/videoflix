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
    email: '',
    send: false,
  };

  /**
   * Initializes the LandingPageComponent with Router, AuthService, and ErrorService.
   */
  constructor(
    private router: Router,
    private authService: AuthService,
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
   * Handles form submission.
   * If the form is valid, checks for duplicate email addresses.
   *
   * @param ngForm The submitted form.
   * @param emailInput The input field for the email.
   */
  async onSubmit(ngForm: NgForm, emailInput: any): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      await this.checkDuplicatesEmail();
    } else {
      emailInput.control.markAsTouched();
    }
  }

  /**
   * Checks whether the entered email already exists.
   * Navigates to the registration page if it's available.
   * Handles UI state and errors accordingly.
   */
  private async checkDuplicatesEmail(): Promise<void> {
    const email = this.authData.email.trim().toLowerCase();
    if (!email) return;

    this.authData.send = true;

    try {
      await this.authService.checkAuthUserEmail({ email });
      this.errorService.clearError();
      this.router.navigate(['/register'], { queryParams: { email: email } });
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      this.authData.send = false;
    }
  }
}
