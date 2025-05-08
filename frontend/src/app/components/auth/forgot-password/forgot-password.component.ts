import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EmailRequestComponent } from './email-request/email-request.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { firstValueFrom } from 'rxjs';

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
  hasVerificationParams: boolean = false;

  verificationParams: { email: string; token: string } = {
    email: '',
    token: '',
  };

  /**
   * Initializes the ForgotPasswordComponent with ActivatedRoute and AuthService.
   */
  constructor(private route: ActivatedRoute, public authService: AuthService) {}

  /**
   * Initializes the component and triggers the email verification process.
   */
  async ngOnInit(): Promise<void> {
    await this.initVerification();
  }

  /**
   * Coordinates the overall email verification process by handling query parameters
   * and calling the verification API if valid data is present.
   */
  private async initVerification(): Promise<void> {
    await this.handleQueryParams();
    if (this.verificationParams.email && this.verificationParams.token) {
      this.hasVerificationParams = true;
    }
  }

  /**
   * Retrieves and processes query parameters from the current route.
   * Extracts the necessary authentication data for verification.
   */
  private async handleQueryParams(): Promise<void> {
    const params = await firstValueFrom(this.route.queryParams);
    this.extractAuthParams(params);
  }

  /**
   * Extracts the 'email' and 'token' values from the given query parameters
   * and stores them in the verifyData object.
   *
   * @param params The query parameters from the current route.
   */
  private extractAuthParams(params: Params): void {
    this.verificationParams = {
      email: params['email'] || '',
      token: params['token'] || '',
    };
  }

  /**
   * Event handler for the completion of the email change request process.
   * Updates the UI to reflect the success status of the email change.
   *
   * @param success A boolean indicating whether the request was successful.
   */
  submittedChangeEmail(success: boolean): void {
    this.emailSendSuccess = success;
  }

  /**
   * Event handler for the completion of the password change request process.
   * Updates the UI to reflect the success status of the password change.
   *
   * @param success A boolean indicating whether the password change was successful.
   */
  submittedChangePassword(success: boolean): void {
    this.passwordChangeSuccess = success;
  }
}
