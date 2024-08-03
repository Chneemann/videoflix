import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { AuthComponent } from '../auth/auth.component';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component';
import { ForgotPasswordComponent } from '../auth/forgot-password/forgot-password.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
    RegisterComponent,
    LoginComponent,
    ForgotPasswordComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentRoute: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.currentRoute = url[0]?.path || '';
    });
  }
}
