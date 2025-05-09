import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../services/error.service';
import { AuthService } from '../../../services/auth.service';
import { emailFormatValidator } from '../../../validators/email-format.validator';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  form: FormGroup = new FormGroup({});

  /**
   * Initializes the LandingPageComponent with Router, FormBuilder, AuthService, and ErrorService.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    public errorService: ErrorService
  ) {}

  /**
   * Initializes the component by setting up necessary data.
   */
  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Initializes the form with required fields and validators.
   */
  private createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailFormatValidator()]],
    });
  }

  /**
   * Handles the submission of the registration form.
   * Validates the form, sends a check if user already exists request,
   * and navigates to the registration page if the user does not exist.
   *
   * @returns A Promise that resolves when the registration process is complete.
   */
  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.form.disable();
    const email = this.form.value.email?.toLowerCase().trim();

    try {
      await this.authService.checkAuthUserEmail({ email });
      this.router.navigate(['/register'], { queryParams: { email } });
      this.form.reset();
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      this.form.enable();
    }
  }
}
