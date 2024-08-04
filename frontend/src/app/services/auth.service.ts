import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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
