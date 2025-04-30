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
   * Fetch the list of videos liked and watched by the current user
   *
   * @returns a promise resolving to an object with two properties:
   *   - `liked_videos`: a list of video IDs liked by the current user
   *   - `watched_videos`: a list of video IDs watched by the current user
   */
  getLikedAndWatchedVideos(): Promise<any> {
    return firstValueFrom(
      this.apiService.get(`/users/${this.currentUserId}/`, true)
    );
  }

  /**
   * Update the list of liked videos for the current user
   *
   * @param likedVideos a list of video IDs liked by the current user
   * @returns a promise resolved when the update is successful
   */
  updateLikedVideos(likedVideos: any): Promise<any> {
    return firstValueFrom(
      this.apiService.put(
        `/users/liked/${this.currentUserId}/`,
        likedVideos,
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
        `/users/watched/${this.currentUserId}/`,
        watchedVideos,
        true
      )
    );
  }
}
