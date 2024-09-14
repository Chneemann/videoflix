import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserId: string | null = null;

  constructor(private http: HttpClient) {}

  async getLikedAndWatchedMovies(): Promise<any> {
    const url = environment.baseUrl + `/users/${this.currentUserId}/`;
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.get(url, { headers }));
  }

  updateLikedMovies(likedMovies: any) {
    const url = `${environment.baseUrl}/users/liked/${this.currentUserId}/`;
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.put(url, likedMovies, { headers }));
  }

  updateWatchedMovies(watchedMovies: any) {
    const url = `${environment.baseUrl}/users/watched/${this.currentUserId}/`;
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.put(url, watchedMovies, { headers }));
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
