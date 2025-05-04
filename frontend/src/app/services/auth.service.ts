import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMsg: string | null = null;
  passwordFieldType = 'password';
  passwordIcon = './assets/img/close-eye.svg';

  /**
   * Initializes the AuthService with ApiService, UserService, and TokenService.
   */
  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  /**
   * Attempts to log in the user with the provided credentials.
   *
   * @param body The login credentials.
   * @param storage Whether to persist the token in local storage.
   * @throws Error if no token is received upon successful login.
   */
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

  /**
   * Logs out the user by calling the API endpoint.
   */
  async logout() {
    await firstValueFrom(this.apiService.post('/auth/logout/', null, true));
  }

  /**
   * Registers a new user.
   *
   * @param body The registration details.
   */
  async register(body: any) {
    await firstValueFrom(this.apiService.post('/auth/register/', body));
  }

  /**
   * Verifies a user's email address.
   *
   * @param body The verification data.
   */
  async verifyEmail(body: any) {
    await firstValueFrom(this.apiService.post('/auth/verify-email/', body));
  }

  /**
   * Initiates a forgot password request.
   *
   * @param body The email address or related information.
   */
  async forgotPassword(body: any) {
    await firstValueFrom(this.apiService.post('/auth/forgot-password/', body));
  }

  /**
   * Changes the user's password.
   *
   * @param body The password change details.
   */
  async changePassword(body: any) {
    await firstValueFrom(this.apiService.post('/auth/change-password/', body));
  }

  /**
   * Checks if a user's email is associated with an authenticated account.
   *
   * @param body The email to verify.
   */
  async checkAuthUserMail(body: any) {
    await firstValueFrom(this.apiService.post('/auth/', body));
  }

  /**
   * Verifies if the current user is authenticated.
   *
   * @returns An Observable emitting true if authenticated, false otherwise.
   */
  checkAuthUser(): Observable<boolean> {
    return this.apiService.get<any>('/auth/', true).pipe(
      map((response) => {
        this.userService.currentUserId = response;
        return true;
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  /**
   * Toggles the password visibility icon based on the current state.
   */
  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './assets/img/close-eye.svg'
        ? './assets/img/open-eye.svg'
        : './assets/img/close-eye.svg';
  }
}
