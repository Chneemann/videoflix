import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ResolutionService } from './resolution.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private movieCache: {
    [key: number]: { [resolution: string]: boolean };
  } = {};
  private availableResolutions: string[];

  /**
   * Initializes the MovieService with ApiService, AuthService, and ResolutionService
   *
   * It fetches the available resolutions from the ResolutionService and stores
   * them in the availableResolutions field.
   */
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private resolutionService: ResolutionService
  ) {
    this.availableResolutions =
      this.resolutionService.getAvailableResolutions();
  }

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
   * Check if a movie is available in all resolutions on the server.
   * This method caches the result to avoid unnecessary requests.
   *
   * @param videoID the ID of the movie to check
   * @returns a promise resolving to an object with the available resolutions
   * as keys and booleans indicating the availability as values.
   */
  isMovieResolutionUploaded(
    videoID: number
  ): Observable<{ [resolution: string]: boolean }> {
    const cachedResolutions = this.movieCache[videoID];

    if (cachedResolutions && Object.values(cachedResolutions).every(Boolean)) {
      return of(cachedResolutions);
    }

    return this.apiService.get(`/video/movie/${videoID}/`, true).pipe(
      map((res: any) => {
        const resolutions = Object.fromEntries(
          this.availableResolutions.map((r) => [r, !!res[r]])
        );
        this.movieCache[videoID] = resolutions;
        return resolutions;
      }),
      catchError((error) => {
        console.error('Failed to fetch movie resolutions', error);
        this.authService.logout();
        return of(
          Object.fromEntries(this.availableResolutions.map((r) => [r, false]))
        );
      })
    );
  }
}
