import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUserId: string | null = null;

  /**
   * Initializes the UserService with ApiService.
   */
  constructor(private apiService: ApiService) {}

  /**
   * Fetch the list of favorite and watched videos for the current user
   *
   * @returns a promise resolving to an object with two properties:
   *   - `favorite_videos`: a list of video IDs favorited by the current user
   *   - `watched_videos`: a list of video IDs watched by the current user
   */
  getUserVideoPreferences(): Promise<any> {
    return firstValueFrom(
      this.apiService.get(`/users/${this.currentUserId}/video-prefs/`, true)
    );
  }

  /**
   * Update the list of favorite videos for the current user
   *
   * @param favoriteVideos a list of video IDs favorited by the current user
   * @returns a promise resolved when the update is successful
   */
  updateFavoriteVideos(favoriteVideos: any): Promise<any> {
    return firstValueFrom(
      this.apiService.put(
        `/users/${this.currentUserId}/favorites/`,
        favoriteVideos,
        true
      )
    );
  }

  /**
   * Update the list of watched videos for the current user
   *
   * @param watchedVideos a list of video IDs watched by the current user
   * @returns a promise resolved when the update is successful
   */
  updateWatchedVideos(watchedVideos: any): Promise<any> {
    return firstValueFrom(
      this.apiService.put(
        `/users/${this.currentUserId}/watched/`,
        watchedVideos,
        true
      )
    );
  }
}
