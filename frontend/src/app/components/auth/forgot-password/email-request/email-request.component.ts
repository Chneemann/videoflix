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

  constructor(
    private errorService: ErrorService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

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

  private createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailFormatValidator()]],
    });
  }

  private createFormRequestBody(): { email: string } {
    return {
      email: this.form.value.email.toLowerCase(),
    };
  }

  private emitFormSubmitted(): void {
    this.submittedChange.emit(true);
  }
}
