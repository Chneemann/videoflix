import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  verificationSuccess: boolean = false;

  verificationParams: { email: string; token: string } = {
    email: '',
    token: '',
  };

  /**
   * Initializes the VerifyEmailComponent with ActivatedRoute, AuthService, and ErrorService.
   */
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

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
      await this.verifyEmail();
    }
  }

  /**
   * Retrieves and processes query parameters from the current route.
   * Extracts the necessary authentication data for email verification.
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
   * Calls the AuthService to verify the user's email using the provided credentials.
   * Updates the verification status and delegates error handling if the request fails.
   */
  private async verifyEmail(): Promise<void> {
    const body: { email: string; token: string } = {
      email: this.verificationParams.email.toLowerCase(),
      token: this.verificationParams.token,
    };

    try {
      await this.authService.verifyEmail(body);
      this.verificationSuccess = true;
    } catch (error) {
      this.verificationSuccess = false;
      this.errorService.handleError(error);
    }
  }
}
