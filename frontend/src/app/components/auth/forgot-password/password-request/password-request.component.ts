import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ErrorService } from '../../../../services/error.service';

@Component({
  selector: 'app-password-request',
  imports: [BtnLargeComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './password-request.component.html',
  styleUrl: './password-request.component.scss',
})
export class PasswordRequestComponent {
  @Input() verificationParams!: { email: string; token: string };

  @Output() submittedChangePassword = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({});

  /**
   * Initializes the PasswordRequestComponent with FormBuilder, AuthService, and ErrorService.
   */
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private errorService: ErrorService
  ) {}

  /**
   * Lifecycle hook that initializes the component.
   * Initializes the form on component load.
   */
  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Handles the form submission for password change.
   * Validates the form, sends a password change request,
   * and emits a submission event on success.
   *
   * @returns A Promise that resolves when the process is complete.
   */
  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      const body = this.createFormRequestBody();
      this.form.disable();

      try {
        await this.authService.changePassword(body);
        this.emitFormSubmitted();
      } catch (error) {
        this.errorService.handleError(error);
      } finally {
        this.form.enable();
      }
    }
  }

  /**
   * Initializes the reactive form with validators.
   */
  private createForm(): void {
    this.form = this.fb.group({
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  /**
   * Constructs the request payload from the form values.
   *
   * @returns An object containing the email, token, and password.
   */
  private createFormRequestBody(): {
    email: string;
    token: string;
    password: string;
  } {
    return {
      email: this.verificationParams.email,
      token: this.verificationParams.token,
      password: this.form.value.password,
    };
  }

  /**
   * Emits an event indicating that the form was successfully submitted.
   */
  private emitFormSubmitted(): void {
    this.submittedChangePassword.emit(true);
  }
}
