import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  errorMsg: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  async login(body: any): Promise<void> {
    const data = await lastValueFrom(
      this.http.post<any>(`${environment.baseUrl}/auth/login/`, body)
    );
    const authToken = data.toString();
    localStorage.setItem('authToken', authToken);
  }

  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get('http://127.0.0.1:8000/users/', { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `token ${authToken}`,
    });
  }
}
