import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorService } from '../../../../services/error.service';
import { AuthService } from '../../../../services/auth.service';
import { emailFormatValidator } from '../../../../validators/email-format.validator';

@Component({
  selector: 'app-email-request',
  imports: [BtnLargeComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './email-request.component.html',
  styleUrl: './email-request.component.scss',
})
export class EmailRequestComponent implements OnInit {
  @Output() submittedChange = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({});

  /**
   * Initializes the EmailRequestComponent with FormBuilder, AuthService, and ErrorService.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
   * Handles the form submission process.
   * Validates the form, sends a forgot-password request,
   * and emits a submission event on success.
   *
   * @returns A Promise that resolves when the process is complete.
   */
  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      const body = this.createFormRequestBody();
      this.form.disable();

      try {
        await this.authService.forgotPassword(body);
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
      email: ['', [Validators.required, emailFormatValidator()]],
    });
  }

  /**
   * Constructs the request payload from the form values.
   *
   * @returns An object containing the normalized email address.
   */
  private createFormRequestBody(): { email: string } {
    return {
      email: this.form.value.email.toLowerCase(),
    };
  }

  /**
   * Emits an event indicating that the form was successfully submitted.
   */
  private emitFormSubmitted(): void {
    this.submittedChange.emit(true);
  }
}
