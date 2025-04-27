import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';

  /**
   * Initializes the TokenService with the Router.
   */
  constructor(private router: Router) {}

  /**
   * Store the given authentication token in either local or session storage.
   *
   * @param token The authentication token to store.
   * @param storage Whether to store the token in local storage (true) or session storage (false).
   */
  setToken(token: string, storage: boolean): void {
    storage
      ? localStorage.setItem(this.TOKEN_KEY, token)
      : sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Returns the authentication token if it exists in either local or session storage.
   * Note that session storage takes precedence over local storage.
   *
   * @returns The authentication token if found, or null otherwise.
   */
  getToken(): string | null {
    const tokenFromSession = sessionStorage.getItem(this.TOKEN_KEY);
    if (tokenFromSession) {
      return tokenFromSession;
    }

    const tokenFromLocal = localStorage.getItem(this.TOKEN_KEY);
    return tokenFromLocal;
  }

  /**
   * Remove the authentication token from both local and session storage.
   * Note that this does not navigate the user away from the current page.
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Clear the session by removing the token from storage and navigating to the home route.
   */
  clearSession(): void {
    this.removeToken();
    this.router.navigate(['/']);
  }
}
