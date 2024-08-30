import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

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
    mail: '',
    token: '',
    send: false,
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.authData.mail = params['email'] || '';
      this.authData.token = params['token'] || '';
      this.verifyEmail();
    });
  }

  async verifyEmail() {
    const body = {
      email: this.authData.mail,
      token: this.authData.token,
    };
    try {
      this.authData.send = true;
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
