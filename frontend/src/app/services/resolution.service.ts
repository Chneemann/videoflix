import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResolutionService {
  private readonly AVAILABLE_RESOLUTIONS = ['360p', '720p', '1080p'];

  /**
   * Returns the centrally defined available resolutions
   */
  getAvailableResolutions(): string[] {
    return this.AVAILABLE_RESOLUTIONS;
  }

  /**
   * Initializes an object that sets all resolutions to `false`
   */
  initMovieIsUploaded(): { [resolution: string]: boolean } {
    return Object.fromEntries(
      this.AVAILABLE_RESOLUTIONS.map((resolution) => [resolution, false])
    );
  }

  /**
   * Returns a default resolution (e.g. '720p'), or the first available resolution.
   */
  getDefaultResolution(): string {
    return this.AVAILABLE_RESOLUTIONS.includes('720p')
      ? '720p'
      : this.AVAILABLE_RESOLUTIONS[0];
  }
}
