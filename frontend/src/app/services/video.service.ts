import { Injectable } from '@angular/core';
import { catchError, filter, firstValueFrom, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ResolutionService } from './resolution.service';
import { Video } from '../interfaces/video.interface';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private videoCache: {
    [key: number]: { [resolution: string]: boolean };
  } = {};
  private availableResolutions: string[];

  /**
   * Initializes the VideoService with HttpClient,ApiService, AuthService, and ResolutionService
   *
   * It fetches the available resolutions from the ResolutionService and stores
   * them in the availableResolutions field.
   */
  constructor(
    private http: HttpClient,
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
   * Fetch a video by its video URL
   *
   * @param videoUrl the ID of the video to fetch
   * @returns a promise resolving to the video object
   */
  getVideoFiles(videoUrl: number): Promise<any> {
    return firstValueFrom(this.apiService.get(`/${videoUrl}`, true));
  }

  /**
   * Upload a video to the server
   *
   * @param formData the FormData object representing the video to upload
   * @returns a promise resolved when the upload is successful
   */
  uploadVideoWithProgress(formData: FormData): Observable<any> {
    return this.apiService.postWithProgress<any>(
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
