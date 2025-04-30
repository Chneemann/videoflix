import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { ResolutionService } from '../../../services/resolution.service';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() playVideo: string = '';

  private hls: Hls | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private resolutionUrls: { [key: string]: string } = {};
  private defaultResolution: string;

  /**
   * Creates a new instance of the VideoPlayerComponent and sets the default
   * resolution by fetching it from the ResolutionService.
   *
   * @param elementRef A reference to the DOM element which hosts the video player.
   * @param resolutionService A service which provides the available resolutions.
   */
  constructor(
    private elementRef: ElementRef,
    private resolutionService: ResolutionService
  ) {
    this.defaultResolution = this.resolutionService.getDefaultResolution();
  }

  /**
   * Angular lifecycle hook: Called once the component is initialized.
   * Initializes the video player with the default resolution.
   */
  ngOnInit(): void {
    this.initializePlayer();
  }

  /**
   * Angular lifecycle hook: Called once the component is about to be destroyed.
   * Cleans up HLS resources.
   */
  ngOnDestroy(): void {
    this.hls?.destroy();
  }

  /**
   * Initializes the video player and loads the default resolution.
   */
  private initializePlayer(): void {
    this.videoElement = this.elementRef.nativeElement.querySelector('video');
    if (!this.playVideo || !this.videoElement) return;

    this.resolutionUrls = this.getResolutionUrls();
    const defaultUrl = this.resolutionUrls[this.defaultResolution];

    if (Hls.isSupported()) {
      this.initHlsPlayer(defaultUrl);
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.initNativePlayer(defaultUrl);
    }

    this.updateScreenDimensions();
  }

  /**
   * Generates a mapping of available resolutions to their respective URLs.
   * @returns An object containing resolution-URL pairs.
   */
  private getResolutionUrls(): { [key: string]: string } {
    return Object.fromEntries(
      this.resolutionService
        .getAvailableResolutions()
        .map((res) => [res, `${this.playVideo}_${res}.m3u8`])
    );
  }

  /**
   * Initializes the video player using HLS.js if supported.
   * @param url - The URL of the video stream to load.
   */
  private initHlsPlayer(url: string): void {
    if (!this.videoElement) return;
    this.hls = new Hls();
    this.hls.loadSource(url);
    this.hls.attachMedia(this.videoElement);
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => this.videoElement?.play());
  }

  /**
   * Initializes the native HTML5 video player if HLS is natively supported.
   * @param url - The URL of the video stream to load.
   */
  private initNativePlayer(url: string): void {
    if (!this.videoElement) return;
    this.videoElement.src = url;
    this.videoElement.addEventListener('canplay', () =>
      this.videoElement?.play()
    );
  }

  /**
   * Updates the video element's dimensions to match the window size.
   */
  private updateScreenDimensions(): void {
    if (!this.videoElement) return;
    this.videoElement.style.width = `${window.innerWidth}px`;
    this.videoElement.style.height = `${window.innerHeight}px`;
  }

  /**
   * Switches the video resolution to the specified one, or falls back to the default resolution if not available.
   * @param resolution - The desired resolution (e.g., '720p', '1080p').
   */
  public switchResolution(resolution: string): void {
    const targetUrl =
      this.resolutionUrls[resolution] ||
      this.resolutionUrls[this.defaultResolution];
    if (targetUrl) {
      this.hls
        ? this.loadHlsSource(targetUrl)
        : this.loadNativeSource(targetUrl);
    } else {
      console.error(`No URL found for resolution '${resolution}'`);
    }
  }

  /**
   * Loads a new video stream source using HLS.js.
   * @param url - The URL of the new video stream.
   */
  private loadHlsSource(url: string): void {
    this.hls?.loadSource(url);
    this.hls?.attachMedia(this.videoElement!);
  }

  /**
   * Loads a new video stream source using the native HTML5 player.
   * @param url - The URL of the new video stream.
   */
  private loadNativeSource(url: string): void {
    if (!this.videoElement) return;
    this.videoElement.src = url;
  }
}
