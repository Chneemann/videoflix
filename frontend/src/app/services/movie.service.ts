import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getAllMovies(): Promise<any> {
    const url = environment.baseUrl + '/content/';
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.get(url, { headers }));
  }

  getMovieFiles(videoUrl: number): Promise<any> {
    const url = environment.baseUrl + `${videoUrl}`;
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.get(url, { headers }));
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
