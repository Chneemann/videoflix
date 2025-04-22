import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';

  constructor(private router: Router) {}

  setToken(token: string, storage: boolean): void {
    storage
      ? localStorage.setItem(this.TOKEN_KEY, token)
      : sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const tokenFromSession = sessionStorage.getItem(this.TOKEN_KEY);
    if (tokenFromSession) {
      return tokenFromSession;
    }

    const tokenFromLocal = localStorage.getItem(this.TOKEN_KEY);
    return tokenFromLocal;
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  clearSession(): void {
    this.removeToken();
    this.router.navigate(['/']);
  }
}
