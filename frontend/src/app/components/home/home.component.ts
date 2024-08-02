import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthComponent } from '../auth/auth.component';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login.component';

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
