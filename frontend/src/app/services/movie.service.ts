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

  getAllMovies(): Promise<any> {
    return firstValueFrom(this.apiService.get('/video/', true));
  }

  getMovieFiles(videoUrl: number): Promise<any> {
    return firstValueFrom(this.apiService.get(`/${videoUrl}`, true));
  }

  uploadMovie(formData: FormData): Promise<any> {
    return firstValueFrom(
      this.apiService.post('/video/upload/', formData, true)
    );
  }

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
