import { Component } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  verified: boolean = false;

  authData = {
    email: '',
    token: '',
    send: false,
  };

  /**
   * Initializes the VerifyEmailComponent with ActivatedRoute, AuthService, and ErrorService.
   */
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Subscribes to query parameters and triggers email verification.
   */
  ngOnInit(): void {
    this.handleQueryParams();
  }

  /**
   * Subscribes to the query parameters from the route and extracts authentication data.
   * Then triggers the email verification process.
   */
  private handleQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.extractAuthParams(params);
      this.verifyEmail();
    });
  }

  /**
   * Extracts the 'email' and 'token' parameters from the query and assigns them to authData.
   *
   * @param params The query parameters from the route.
   */
  private extractAuthParams(params: Params): void {
    this.authData.email = params['email'] || '';
    this.authData.token = params['token'] || '';
  }

  /**
   * Sends a request to verify the user's email using the extracted authentication data.
   * Sets the appropriate flags based on the result and handles errors if any occur.
   */
  private async verifyEmail(): Promise<void> {
    const body = {
      email: this.authData.email.toLowerCase(),
      token: this.authData.token,
    };

    this.authData.send = true;
    try {
      await this.authService.verifyEmail(body);
      this.verified = true;
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.verified = false;
      this.errorService.handleError(error);
    }
  }
}
