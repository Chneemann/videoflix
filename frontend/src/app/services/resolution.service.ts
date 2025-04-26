import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResolutionService {
  private readonly AVAILABLE_RESOLUTIONS = ['360p', '720p', '1080p'];

  /**
   * Gibt die zentral definierten verfügbaren Auflösungen zurück
   */
  getAvailableResolutions(): string[] {
    return this.AVAILABLE_RESOLUTIONS;
  }

  /**
   * Initialisiert ein Objekt, das alle Auflösungen auf `false` setzt
   */
  initMovieIsUploaded(): { [resolution: string]: boolean } {
    return Object.fromEntries(
      this.AVAILABLE_RESOLUTIONS.map((resolution) => [resolution, false])
    );
  }

  /**
   * Gibt eine Standardauflösung zurück (z.B. '720p'), oder die erste verfügbare
   */
  getDefaultResolution(): string {
    return this.AVAILABLE_RESOLUTIONS.includes('720p')
      ? '720p'
      : this.AVAILABLE_RESOLUTIONS[0];
  }
}
