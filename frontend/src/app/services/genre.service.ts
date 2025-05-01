import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface FilmGenre {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private genres: FilmGenre[] = [];

  constructor(private apiService: ApiService) {}

  /**
   * Returns the genres either from the cache or from the API endpoint.
   * @returns observable of movie genres
   */
  getGenres(): Observable<FilmGenre[]> {
    if (this.genres.length > 0) {
      return of(this.genres);
    }

    return this.apiService.get<FilmGenre[]>('/video/genres/', true).pipe(
      tap((data) => {
        this.genres = data;
      })
    );
  }
}
