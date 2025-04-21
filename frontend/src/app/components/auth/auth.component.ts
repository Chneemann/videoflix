import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../auth/verify-email/verify-email.component';
import { ErrorToastComponent } from '../../shared/components/error-toast/error-toast.component';
import { ErrorService } from '../../services/error.service';
import { LandingPageComponent } from './landing-page/landing-page.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ErrorToastComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  currentRoute: any;

  constructor(
    private route: ActivatedRoute,
    public errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.currentRoute = url[0]?.path || '';
    });
  }
}
