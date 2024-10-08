import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  authData = {
    mail: '',
    token: '',
    password: '',
    passwordConfirm: '',
    send: false,
  };

  sendMailSuccess: boolean = false;
  queryEmail: boolean = false;
  queryEmailSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.authData.mail = params['email'] || '';
      this.authData.token = params['token'] || '';
      this.queryEmailSuccess = params['pw-change'] || '';
    });
    if (this.authData.mail && this.authData.token) {
      this.queryEmail = true;
    }
  }

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  async onSubmit(ngForm: NgForm, mailInput: any) {
    if (ngForm.submitted && ngForm.form.valid) {
      if (mailInput.name === 'mail') {
        try {
          await this.verifyEmail();
          ngForm.form.reset();
        } catch {}
      } else if (mailInput.name === 'password') {
        try {
          await this.changePassword();
          ngForm.form.reset();
        } catch {}
      }
    } else {
      mailInput.control.markAsTouched();
    }
  }

  async verifyEmail() {
    const body = {
      email: this.authData.mail,
    };
    try {
      this.authData.send = true;
      await this.authService.forgotPassword(body);
      this.sendMailSuccess = true;
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.sendMailSuccess = false;
      this.errorService.handleError(error);
    }
  }

  async changePassword() {
    const body = {
      email: this.authData.mail,
      token: this.authData.token,
      new_password: this.authData.password,
    };
    try {
      this.authData.send = true;
      await this.authService.changePassword(body);
      this.queryEmail = false;
      this.queryEmailSuccess = true;
      this.errorService.clearError();
    } catch (error) {
      this.authData.send = false;
      this.errorService.handleError(error);
    }
  }
}
