import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImprintComponent } from './shared/components/legal-information/imprint/imprint.component';
import { PrivacyPolicyComponent } from './shared/components/legal-information/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: HomeComponent },
  { path: 'register', component: HomeComponent },
  { path: 'forgot-password', component: HomeComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
