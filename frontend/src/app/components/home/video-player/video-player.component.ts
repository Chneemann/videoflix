import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { ResolutionService } from '../../../services/resolution.service';
import { VideoProgressService } from '../../../services/video-progress.service';
import { Video } from '../../../interfaces/video.interface';
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
  @Input() currentVideo: Video | null = null;

  private hls: Hls | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private videoElement: HTMLVideoElement | null = null;

  private availableResolutions: { [key: string]: string } = {};
  private defaultResolution: string;

  /**
   * Initializes the VideoPlayerComponent with the ElementRef, ResolutionService and VideoProgressService.
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
   * Cleans up the player, stops tracking video progress and disconnects the resize observer.
   */
  ngOnDestroy(): void {
    this.hls?.destroy();
    this.videoProgressService.stopTracking();
    this.resizeObserver?.disconnect();
  }

  /**
   * Sets up the video player by initializing the video element,
   * generating resolution URLs, loading initial playback progress,
   * and setting up resize observation.
   */
  private setupPlayer(): void {
    this.videoElement = this.elementRef.nativeElement.querySelector('video');
    if (!this.playVideo || !this.videoElement) return;

    this.availableResolutions = this.generateResolutions();
    const defaultUrl = this.availableResolutions[this.defaultResolution];

    this.loadInitialProgress(defaultUrl);
    this.observeResize();
  }

  /**
   * Loads the initial playback progress for the current video and initializes the player.
   * Starts tracking the playback progress. Falls back to start at 0 on error.
   *
   * @param url - The video URL to initialize the player with.
   */
  private loadInitialProgress(url: string): void {
    this.videoProgressService
      .getInitialProgress(this.currentVideo!.id)
      .then((startTime) => {
        this.initPlayer(url, startTime);
        this.videoProgressService.startTracking(
          this.videoElement!,
          this.currentVideo!.id
        );
      })
      .catch((error) => {
        console.error('Error loading the progress:', error);
        this.initPlayer(url, 0);
      });
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
          this.videoElement.play().catch(console.error);
        }
      });
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = url;
      this.videoElement.addEventListener('canplay', () => {
        this.videoElement!.currentTime = startTime;
        this.videoElement!.play().catch(console.error);
      });
    }
  }

  /**
   * Generates a mapping of available video resolutions to their stream URLs.
   * @returns An object like { '720p': 'video_720p.m3u8', '1080p': 'video_1080p.m3u8' }.
   */
  private generateResolutions(): { [key: string]: string } {
    return this.resolutionService
      .getAvailableResolutions()
      .reduce((acc, res) => {
        acc[res] = `${this.playVideo}_${res}.m3u8`;
        return acc;
      }, {} as { [key: string]: string });
  }

  /**
   * Updates the video element's dimensions to match the window size.
   */
  private observeResize(): void {
    if (!this.videoElement) return;
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.videoElement) return;
      const { clientWidth, clientHeight } = document.documentElement;
      this.videoElement.style.width = `${clientWidth}px`;
      this.videoElement.style.height = `${clientHeight}px`;
    });
    this.resizeObserver.observe(document.body);
  }

  /**
   * Switches the video resolution to the specified one, or falls back to the default resolution if not available.
   * @param resolution - The desired resolution (e.g., '720p', '1080p').
   */
  public switchResolution(resolution: string): void {
    const targetUrl =
      this.availableResolutions[resolution] ||
      this.availableResolutions[this.defaultResolution];
    if (!targetUrl) {
      console.error(`No URL found for resolution '${resolution}'`);
      return;
    }

    if (this.hls) {
      this.loadHlsSource(targetUrl);
    } else {
      this.loadNativeSource(targetUrl);
    }

    this.videoElement?.play().catch(console.error);
  }

  /**
   * Loads a new video stream source using HLS.js.
   * @param url - The URL of the new video stream.
   */
  private loadHlsSource(url: string): void {
    if (!this.hls || !this.videoElement) return;
    this.hls.loadSource(url);
    this.hls.attachMedia(this.videoElement);
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
