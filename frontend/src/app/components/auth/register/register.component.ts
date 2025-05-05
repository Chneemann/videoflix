import { Component, OnInit } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registrationSuccess: boolean = false;

  authData = {
    mail: '',
    password: '',
    passwordConfirm: '',
    privacyPolicy: false,
    send: false,
  };

  /**
   * Initializes the RegisterComponent with ActivatedRoute, AuthService, and ErrorService.
   */
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Initializes the component by setting up necessary data.
   */
  ngOnInit(): void {
    this.setEmailFromQueryParams();
  }

  /**
   * Sets the email address from the query parameters in the URL.
   */
  private setEmailFromQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.authData.mail = params['mail'] || '';
    });
  }

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
   * Handles form submission for user registration.
   * Sends registration request and handles success/error responses.
   *
   * @param ngForm The registration form instance.
   */
  async onSubmit(ngForm: NgForm): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = this.createRegistrationRequestBody();

      this.authData.send = true;

      try {
        await this.authService.register(body);
        ngForm.resetForm();
        this.registrationSuccess = true;
        this.errorService.clearError();
      } catch (error) {
        this.authData.send = false;
        this.errorService.handleError(error);
      }
    }
  }

  /**
   * Creates the request body for the registration API.
   *
   * @returns The registration request body.
   */
  private createRegistrationRequestBody(): {
    email: string;
    username: string;
    password: string;
  } {
    return {
      email: this.authData.mail.toLowerCase(),
      username: this.authData.mail.split('@')[0],
      password: this.authData.password,
    };
  }
}
