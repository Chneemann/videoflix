import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMsg: string | null = null;
  passwordFieldType: string = 'password';
  passwordIcon: string = './../../../assets/img/close-eye.svg';

  constructor(private http: HttpClient, private userService: UserService) {}

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
    this.toggleIcon();
  }

  toggleIcon() {
    this.passwordIcon =
      this.passwordIcon === './../../../assets/img/close-eye.svg'
        ? './../../../assets/img/open-eye.svg'
        : './../../../assets/img/close-eye.svg';
  }

  async register(body: any) {
    await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/register/`, body)
    );
  }

  async login(body: any, storage: boolean) {
    const data = (await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/login/`, body)
    )) as { token: string };
    this.storeAuthToken(data.token, storage);
  }

  async verifyEmail(body: any) {
    await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/verify-email/`, body)
    );
  }

  async forgotPassword(body: any) {
    await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/forgot-password/`, body)
    );
  }

  async changePassword(body: any) {
    await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/change-password/`, body)
    );
  }

  storeAuthToken(data: any, storage: boolean) {
    storage
      ? localStorage.setItem('authToken', data.toString())
      : sessionStorage.setItem('authToken', data.toString());
  }

  checkAuthUser(): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.baseUrl}/auth/`, { headers }).pipe(
      map((response) => {
        this.saveUserId(response);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  saveUserId(userId: string): void {
    this.userService.currentUserId = userId;
  }

  async checkAuthUserMail(body: any) {
    await lastValueFrom(this.http.post(`${environment.baseUrl}/auth/`, body));
  }

  private getAuthHeaders(): HttpHeaders {
    let authToken = localStorage.getItem('authToken');
    if (!authToken) {
      authToken = sessionStorage.getItem('authToken');
    }
    return new HttpHeaders({
      Authorization: `Token ${authToken}`, // Ensure this matches your backend
    });
  }
}
