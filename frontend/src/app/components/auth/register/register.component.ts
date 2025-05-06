import { Component, OnInit } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { emailFormatValidator } from '../../../validators/email-format.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    BtnLargeComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registrationSuccess: boolean = false;
  form: FormGroup = new FormGroup({});

  /**
   * Initializes the RegisterComponent with ActivatedRoute, FormBuilder, AuthService, and ErrorService.
   */
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Initializes the component by setting up necessary data.
   */
  ngOnInit(): void {
    this.createRegisterForm();
    this.setEmailFromQueryParams();
  }

  /**
   * Initializes the registration form with required fields and validators.
   */
  private createRegisterForm(): void {
    this.form = this.fb.group({
      mail: ['', [Validators.required, emailFormatValidator()]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      privacyPolicy: [false, Validators.requiredTrue],
    });
  }

  /**
   * Sets the email address from the query parameters in the URL.
   */
  private setEmailFromQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      const email = params['mail'] || '';
      this.form.patchValue({ mail: email });
    });
  }

  /**
   * Handles the submission of the registration form.
   *
   * @returns A Promise that resolves when the registration process is complete.
   */
  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      const body = this.createRegistrationRequestBody();
      this.form.disable();

      try {
        await this.authService.register(body);
        this.form.reset();
        this.registrationSuccess = true;
        this.errorService.clearError();
      } catch (error) {
        this.form.enable();
        this.errorService.handleError(error);
      }
    }
  }

  /**
   * Constructs the registration request payload from form values.
   *
   * @returns An object containing the email (lowercased), username (from email), and password.
   */
  private createRegistrationRequestBody(): {
    email: string;
    username: string;
    password: string;
  } {
    const formValue = this.form.value;
    return {
      email: formValue.mail.toLowerCase(),
      username: formValue.mail.split('@')[0],
      password: formValue.password,
    };
  }
}
