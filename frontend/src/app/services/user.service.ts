import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserId: string | null = null;

  constructor(private http: HttpClient) {}

  async getLikedMovies(): Promise<any> {
    const url = environment.baseUrl + `/users/${this.currentUserId}/`;
    const headers = this.getAuthHeaders();

    return lastValueFrom(this.http.get(url, { headers }));
  }

  private getAuthHeaders(): HttpHeaders {
    let authToken = localStorage.getItem('authToken');
    if (!authToken) {
      authToken = sessionStorage.getItem('authToken');
    }
    return new HttpHeaders({
      Authorization: `Token ${authToken}`,
    });
  }
}
