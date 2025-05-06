import { Component, OnInit } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { emailFormatValidator } from '../../../validators/email-format.validator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    BtnLargeComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  form: FormGroup = new FormGroup({});

  /**
   * Initializes the LoginComponent with Router, FormBuilder, AuthService, and ErrorService.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Initializes the component by setting up necessary data.
   */
  ngOnInit(): void {
    this.createLoginForm();
  }

  /**
   * Initializes the login form with required fields and validators.
   */
  private createLoginForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailFormatValidator()]],
      password: ['', Validators.required],
      keepLoggedIn: [false],
    });
  }

  /**
   * Handles the submission of the login form.
   *
   * @returns A Promise that resolves when the login process is complete.
   */
  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const body = this.createLoginRequestBody();

    await this.performLogin(body);
  }

  /**
   * Initiates a guest login by preparing guest credentials and performing the login request.
   *
   * @returns A Promise that resolves when the login process is complete.
   */
  async guestLogin(): Promise<void> {
    this.prepareGuestLoginData();
    const body = this.createLoginRequestBody();

    await this.performLogin(body);
  }

  /**
   * Prepares the authentication data for a guest login.
   */
  private prepareGuestLoginData(): void {
    this.form.patchValue({
      email: environment.guestEmail.toLowerCase(),
      password: environment.guestPassword,
    });
  }

  /**
   * Performs the login process.
   *
   * @param body The login request body containing email, password, and keepLoggedIn.
   * @returns A Promise that resolves when the login process is complete.
   */
  private async performLogin(body: any): Promise<void> {
    try {
      this.form.disable();
      await this.authService.login(body);
      this.form.reset();
      this.router.navigate(['/browse/']);
    } catch (error) {
      this.form.enable();
      this.errorService.handleError(error);
    }
  }

  /**
   * Creates the request body for the login API.
   *
   * @param email The email for the login request.
   * @param password The password for the login request.
   * @param keepLoggedIn Whether to keep the user signed in.
   * @returns The body of the login request.
   */
  private createLoginRequestBody(): {
    email: string;
    password: string;
    keepLoggedIn: boolean;
  } {
    const formValue = this.form.value;
    return {
      email: formValue.email.toLowerCase(),
      password: formValue.password,
      keepLoggedIn: formValue.keepLoggedIn,
    };
  }
}
