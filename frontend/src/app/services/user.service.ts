import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserId: string | null = null;

  constructor(private apiService: ApiService) {}

  getLikedAndWatchedMovies(): Promise<any> {
    return firstValueFrom(
      this.apiService.get(`/users/${this.currentUserId}/`, true)
    );
  }

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
