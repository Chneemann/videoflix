import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMsg: string | null = null;
  passwordFieldType = 'password';
  passwordIcon = './assets/img/close-eye.svg';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  async login(body: any, storage: boolean) {
    const data = await firstValueFrom(
      this.apiService.post<{ token: string }>('/auth/login/', body)
    );
    if (data?.token) {
      this.tokenService.setToken(data.token, storage);
    } else {
      throw new Error('Login failed: No token received');
    }
  }

  async logout() {
    await firstValueFrom(this.apiService.post('/auth/logout/', null, true));
  }

  async register(body: any) {
    await firstValueFrom(this.apiService.post('/auth/register/', body));
  }

  async verifyEmail(body: any) {
    await firstValueFrom(this.apiService.post('/auth/verify-email/', body));
  }

  async forgotPassword(body: any) {
    await firstValueFrom(this.apiService.post('/auth/forgot-password/', body));
  }

  async changePassword(body: any) {
    await firstValueFrom(this.apiService.post('/auth/change-password/', body));
  }

  async checkAuthUserMail(body: any) {
    await firstValueFrom(this.apiService.post('/auth/', body));
  }

  checkAuthUser(): Observable<boolean> {
    return this.apiService.get<any>('/auth/', true).pipe(
      map((response) => {
        this.userService.currentUserId = response;
        return true;
      }),
      catchError(() => of(false))
    );
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './assets/img/close-eye.svg'
        ? './assets/img/open-eye.svg'
        : './assets/img/close-eye.svg';
  }
}
