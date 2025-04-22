import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    if (!token) {
      this.tokenService.clearSession();
    }
    return new HttpHeaders({ Authorization: `Token ${token}` });
  }

  get<T>(endpoint: string, auth: boolean = false): Observable<T> {
    const headers = auth ? { headers: this.getAuthHeaders() } : {};
    return this.http
      .get<T>(`${environment.baseUrl}${endpoint}`, headers)
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any, auth: boolean = false): Observable<T> {
    const headers = auth ? { headers: this.getAuthHeaders() } : {};
    return this.http
      .post<T>(`${environment.baseUrl}${endpoint}`, body, headers)
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: any, auth: boolean = false): Observable<T> {
    const headers = auth ? { headers: this.getAuthHeaders() } : {};
    return this.http
      .put<T>(`${environment.baseUrl}${endpoint}`, body, headers)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
