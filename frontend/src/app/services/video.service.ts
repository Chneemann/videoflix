import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ResolutionService } from './resolution.service';
import { Video } from '../interfaces/video.interface';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private videoCache: {
    [key: number]: { [resolution: string]: boolean };
  } = {};
  private availableResolutions: string[];

  /**
   * Initializes the VideoService with ApiService, AuthService, and ResolutionService
   * Get the available resolutions
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
   * Fetch all videos available on the server
   *
   * @returns a promise resolving to an array of video objects
   */
  getAllVideos(): Promise<Video[]> {
    return firstValueFrom(this.apiService.get('/videos/', true));
  }

  /**
   * Uploads a video file to the server with progress tracking.
   *
   * @param formData The FormData object representing the video to upload.
   * @returns An Observable emitting HttpEvent objects (e.g., progress, response).
   */
  uploadVideoWithProgress(formData: FormData): Observable<HttpEvent<any>> {
    return this.apiService.postWithUploadEvents<any>(
      '/video/upload/',
      formData,
      true,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  /**
   * Check if a video is available in all resolutions on the server.
   * This method caches the result to avoid unnecessary requests.
   *
   * @param videoID the ID of the video to check
   * @returns a promise resolving to an object with the available resolutions
   * as keys and booleans indicating the availability as values.
   */
  isVideoResolutionUploaded(
    videoID: number
  ): Observable<{ [resolution: string]: boolean }> {
    const cachedResolutions = this.videoCache[videoID];

    if (cachedResolutions && Object.values(cachedResolutions).every(Boolean)) {
      return of(cachedResolutions);
    }

    return this.apiService.get(`/video/${videoID}/`, true).pipe(
      map((res: any) => {
        const resolutions = Object.fromEntries(
          this.availableResolutions.map((r) => [r, !!res[r]])
        );
        this.videoCache[videoID] = resolutions;
        return resolutions;
      }),
      catchError((error) => {
        console.error('Failed to fetch video resolutions', error);
        this.authService.logout();
        return of(
          Object.fromEntries(this.availableResolutions.map((r) => [r, false]))
        );
      })
    );
  }
}
