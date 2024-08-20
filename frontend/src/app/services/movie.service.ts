import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private movieCache: { [key: number]: { [resolution: string]: boolean } } = {};

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

  uploadMovie(formData: FormData) {
    const url = environment.baseUrl + '/content/upload/';
    const headers = this.getAuthHeaders();
    return lastValueFrom(this.http.post(url, formData, { headers }));
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

  /**
   * Checks if a movie is uploaded in multiple resolutions.
   *
   * @param {number} videoID - The ID of the movie to check.
   * @returns {Observable<{ [resolution: string]: boolean }>} Observable emitting an object with the availability of each resolution.
   */
  isMovieResolutionUploaded(
    videoID: number
  ): Observable<{ [resolution: string]: boolean }> {
    if (this.movieCache.hasOwnProperty(videoID)) {
      const cachedResolutions = this.movieCache[videoID];

      const missingResolutions = Object.keys(cachedResolutions).filter(
        (res) => !cachedResolutions[res]
      );

      if (missingResolutions.length === 0) {
        return new BehaviorSubject(cachedResolutions).asObservable();
      } else {
        return this.fetchAndCacheResolutions(videoID);
      }
    } else {
      return this.fetchAndCacheResolutions(videoID);
    }
  }

  /**
   * Fetches the availability of multiple resolutions for a specific movie.
   *
   * @param {number} videoID - The ID of the movie to fetch resolutions for.
   * @returns {Observable<{ [resolution: string]: boolean }>} Observable emitting an object with the availability of each resolution.
   */
  private fetchAndCacheResolutions(
    videoID: number
  ): Observable<{ [resolution: string]: boolean }> {
    const url = `${environment.baseUrl}/content/movie/${videoID}/`;
    const headers = this.getAuthHeaders();

    return new Observable<{ [resolution: string]: boolean }>((observer) => {
      this.http.get(url, { headers }).subscribe(
        (response: any) => {
          const resolutions = {
            '480': response['480'] || false,
            '720': response['720'] || false,
            '1080': response['1080'] || false,
          };
          this.movieCache[videoID] = resolutions;
          observer.next(resolutions);
          observer.complete();
        },
        (error) => {
          observer.next(
            this.movieCache[videoID] || {
              '480': false,
              '720': false,
              '1080': false,
            }
          );
          observer.complete();
        }
      );
    });
  }
}
