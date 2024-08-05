import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMsg: string | null = null;

  constructor(private http: HttpClient) {}

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

  storeAuthToken(data: any, storage: boolean) {
    storage
      ? localStorage.setItem('authToken', data.toString())
      : sessionStorage.setItem('authToken', data.toString());
  }

  async register(body: any) {
    await lastValueFrom(
      this.http.post(`${environment.baseUrl}/auth/register/`, body)
    );
  }
}
