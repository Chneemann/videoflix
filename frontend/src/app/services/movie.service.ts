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

  uploadMovie(formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${environment.baseUrl}/content/upload/`,
      formData,
      { headers }
    );
  }

  checkThumbnailStatus(
    videoId: number
  ): Observable<{ thumbnail_created: boolean }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ thumbnail_created: boolean }>(
      `${environment.baseUrl}/content/${videoId}/status/`,
      { headers }
    );
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
