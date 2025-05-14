import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { ResolutionService } from '../../../services/resolution.service';
import Hls from 'hls.js';
import { VideoProgressService } from '../../../services/video-progress.service';
import { Video } from '../../../interfaces/video.interface';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() playVideo: string = '';
  @Input() currentVideo: Video | null = null;

  private hls: Hls | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private resolutionUrls: { [key: string]: string } = {};
  private defaultResolution: string;

  /**
   * Initializes the VideoPlayerComponent with the ElementRef, ResolutionService and VideoProgressService.
   * Get the default resolution.
   */
  constructor(
    private elementRef: ElementRef,
    private resolutionService: ResolutionService,
    private videoProgressService: VideoProgressService
  ) {
    this.defaultResolution = this.resolutionService.getDefaultResolution();
  }

  /**
   * Lifecycle hook: Called once the component is initialized.
   * Sets up the player and starts tracking video progress.
   */
  ngOnInit(): void {
    this.setupPlayer();
  }

  /**
   * Angular lifecycle hook: Called once the component is about to be destroyed.
   * Cleans up HLS resources and stops tracking video progress.
   */
  ngOnDestroy(): void {
    this.hls?.destroy();
    this.videoProgressService.stopTracking();
  }

  /**
   * Sets up the video player by initializing the video element, retrieving resolution URLs,
   * and obtaining the initial playback position for the current video. It also starts tracking
   * the video's playback progress and updates the video's screen dimensions.
   */
  private setupPlayer(): void {
    this.videoElement = this.elementRef.nativeElement.querySelector('video');
    if (!this.playVideo || !this.videoElement) return;

    this.resolutionUrls = this.getResolutionUrls();
    const defaultUrl = this.resolutionUrls[this.defaultResolution];

    this.videoProgressService
      .getInitialProgress(this.currentVideo!.id)
      .then((startTime) => {
        this.initPlayer(defaultUrl, startTime);
        this.videoProgressService.startTracking(
          this.videoElement!,
          this.currentVideo!.id
        );
      });

    this.updateScreenDimensions();
  }

  /**
   * Initializes the video player using HLS.js if supported, or falls back to native HTML5 support.
   * @param url - The URL of the video stream to load.
   * @param startTime - The initial playback position of the video in seconds.
   */
  private initPlayer(url: string, startTime: number): void {
    if (!this.videoElement) return;

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(url);
      this.hls.attachMedia(this.videoElement);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (this.videoElement) {
          this.videoElement.currentTime = startTime;
          this.videoElement.play();
        }
      });
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = url;
      this.videoElement.addEventListener('canplay', () => {
        this.videoElement!.currentTime = startTime;
        this.videoElement!.play();
      });
    }
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
