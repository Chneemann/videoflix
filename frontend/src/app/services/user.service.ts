import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserId: string | null = null;

  constructor(private apiService: ApiService) {}

  /**
   * Fetch the list of movies liked and watched by the current user
   *
   * @returns a promise resolving to an object with two properties:
   *   - `liked_movies`: a list of movie IDs liked by the current user
   *   - `watched_movies`: a list of movie IDs watched by the current user
   */
  getLikedAndWatchedMovies(): Promise<any> {
    return firstValueFrom(
      this.apiService.get(`/users/${this.currentUserId}/`, true)
    );
  }

  /**
   * Update the list of liked movies for the current user
   *
   * @param likedMovies a list of movie IDs liked by the current user
   * @returns a promise resolved when the update is successful
   */
  updateLikedMovies(likedMovies: any): Promise<any> {
    return firstValueFrom(
      this.apiService.put(
        `/users/liked/${this.currentUserId}/`,
        likedMovies,
        true
      )
    );
  }

  updateWatchedMovies(watchedMovies: any): Promise<any> {
    return firstValueFrom(
      this.apiService.put(
        `/users/watched/${this.currentUserId}/`,
        watchedMovies,
        true
      )
    );
  }
}
