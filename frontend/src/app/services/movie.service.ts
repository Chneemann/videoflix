import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
} from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private movieCache: { [key: number]: { [resolution: string]: boolean } } = {};

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Fetch all movies available on the server
   *
   * @returns a promise resolving to an array of movie objects
   */
  getAllMovies(): Promise<any> {
    return firstValueFrom(this.apiService.get('/video/', true));
  }

  /**
   * Fetch a movie by its video URL
   *
   * @param videoUrl the ID of the movie to fetch
   * @returns a promise resolving to the movie object
   */
  getMovieFiles(videoUrl: number): Promise<any> {
    return firstValueFrom(this.apiService.get(`/${videoUrl}`, true));
  }

  /**
   * Upload a movie to the server
   *
   * @param formData the FormData object representing the movie to upload
   * @returns a promise resolved when the upload is successful
   */
  uploadMovie(formData: FormData): Promise<any> {
    return firstValueFrom(
      this.apiService.post('/video/upload/', formData, true)
    );
  }

  /**
   * Checks if a movie with the given video ID has been uploaded in the following resolutions: 360p, 720p, 1080p.
   *
   * @param videoID the ID of the movie to check
   * @returns an observable that emits an object with the following properties:
   *  - '360': a boolean indicating whether the movie has been uploaded in 360p resolution
   *  - '720': a boolean indicating whether the movie has been uploaded in 720p resolution
   *  - '1080': a boolean indicating whether the movie has been uploaded in 1080p resolution
   */
  isMovieResolutionUploaded(
    videoID: number
  ): Observable<{ [resolution: string]: boolean }> {
    const cachedRes = this.movieCache[videoID];
    if (cachedRes && Object.values(cachedRes).every(Boolean)) {
      return new BehaviorSubject(cachedRes).asObservable();
    }

    return this.apiService.get(`/video/movie/${videoID}/`, true).pipe(
      map((res: any) => {
        const resolutions = {
          '360': res['360'] || false,
          '720': res['720'] || false,
          '1080': res['1080'] || false,
        };
        this.movieCache[videoID] = resolutions;
        return resolutions;
      }),
      catchError(() => {
        this.authService.logout();
        return of({ '360': false, '720': false, '1080': false });
      })
    );
  }
}
