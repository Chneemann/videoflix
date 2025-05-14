import { Injectable } from '@angular/core';
import { firstValueFrom, interval, Observable, Subscription } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class VideoProgressService {
  private subscription: Subscription | null = null;

  /**
   * Initializes the VideoProgressService with ApiService.
   */
  constructor(private apiService: ApiService) {}

  /**
   * Starts tracking the playback position of a video at regular intervals.
   * Progress is only saved if the video is currently playing.
   *
   * @param videoElement - The HTMLVideoElement to track.
   * @param videoId - The unique ID of the video.
   * @param intervalSec - The interval in seconds at which progress is saved (default is 5 seconds).
   */
  startTracking(
    videoElement: HTMLVideoElement,
    videoId: number,
    intervalSec = 5
  ): void {
    this.stopTracking();
    this.subscription = interval(intervalSec * 1000).subscribe(() => {
      const position = videoElement.currentTime;

      if (!videoElement.paused && !videoElement.ended && !isNaN(position)) {
        this.saveProgress(videoId, position).subscribe({
          error: (err) => console.error('Progress save failed:', err),
        });
      }
    });
  }

  /**
   * Stops tracking video progress and clears the subscription.
   */
  stopTracking(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  /**
   * Retrieves the last saved playback position for a given video.
   *
   * @param videoId - The unique ID of the video.
   * @returns A promise resolving to the last saved position in seconds, or 0 if unavailable.
   */
  async getInitialProgress(videoId: number): Promise<number> {
    try {
      const res = await firstValueFrom(this.getProgress(videoId));
      return res?.position ?? 0;
    } catch (err) {
      console.warn(`No saved progress for video ${videoId}`, err);
      return 0;
    }
  }

  /**
   * Fetches the saved progress for a specific video from the backend.
   *
   * @param videoId - The unique ID of the video.
   * @returns An observable containing the progress object with `position` in seconds.
   */
  getProgress(videoId: number): Observable<{ position: number }> {
    return this.apiService.get<{ position: number }>(
      `/video/progress/${videoId}`,
      true
    );
  }

  /**
   * Sends the current playback position of a video to the backend for saving.
   *
   * @param videoId - The unique ID of the video.
   * @param position - The current playback position in seconds.
   * @returns An observable representing the HTTP POST request.
   */
  saveProgress(videoId: number, position: number): Observable<any> {
    return this.apiService.post(
      `/video/progress/${videoId}`,
      { position },
      true
    );
  }
}
