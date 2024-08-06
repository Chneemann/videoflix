import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMsg: string | null = null;

  constructor(private http: HttpClient) {}

  async register(body: any) {
    await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/register/`, body)
    );
  }

  async login(body: any, storage: boolean) {
    const data = await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/login/`, body)
    );
    this.storeAuthToken(data, storage);
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
      map((response) => true),
      catchError(() => of(false))
    );
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
