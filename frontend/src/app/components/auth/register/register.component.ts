import { Component, OnInit } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  authData = {
    mail: '',
    password: '',
    passwordConfirm: '',
    privacyPolicy: false,
    send: false,
  };

  registrationSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.authData.mail = params['mail'] || '';
    });
  }

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const body = {
        email: this.authData.mail,
        username: this.authData.mail.split('@')[0],
        password: this.authData.password,
      };
      try {
        this.authData.send = true;
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
}
