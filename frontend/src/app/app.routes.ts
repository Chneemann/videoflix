import { Routes } from '@angular/router';
import { ImprintComponent } from './shared/components/legal-information/imprint/imprint.component';
import { PrivacyPolicyComponent } from './shared/components/legal-information/privacy-policy/privacy-policy.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  { path: 'forgot-password', component: AuthComponent },
  { path: 'verify-email', component: AuthComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'browse', component: HomeComponent, canActivate: [AuthGuard] },
];
