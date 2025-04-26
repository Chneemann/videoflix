import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { ResolutionService } from '../../../services/resolution.service';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() playMovie: string = '';
  private hls: Hls | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private resolutionUrls: { [key: string]: string } = {};
  private defaultResolution: string;

  constructor(
    private elementRef: ElementRef,
    private resolutionService: ResolutionService
  ) {
    this.defaultResolution = this.resolutionService.getDefaultResolution();
  }

  ngOnInit(): void {
    this.initializePlayer();
  }

  ngOnDestroy(): void {
    this.hls?.destroy();
  }

  private initializePlayer(): void {
    this.videoElement = this.elementRef.nativeElement.querySelector('video');
    if (!this.playMovie || !this.videoElement) return;

    this.resolutionUrls = this.getResolutionUrls();
    const defaultUrl = this.resolutionUrls[this.defaultResolution];

    if (Hls.isSupported()) {
      this.initHlsPlayer(defaultUrl);
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.initNativePlayer(defaultUrl);
    }

    this.updateScreenDimensions();
  }

  private getResolutionUrls(): { [key: string]: string } {
    return Object.fromEntries(
      this.resolutionService
        .getAvailableResolutions()
        .map((res) => [res, `${this.playMovie}_${res}.m3u8`])
    );
  }

  private initHlsPlayer(url: string): void {
    if (!this.videoElement) return;
    this.hls = new Hls();
    this.hls.loadSource(url);
    this.hls.attachMedia(this.videoElement);
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => this.videoElement?.play());
  }

  private initNativePlayer(url: string): void {
    if (!this.videoElement) return;
    this.videoElement.src = url;
    this.videoElement.addEventListener('canplay', () =>
      this.videoElement?.play()
    );
  }

  private updateScreenDimensions(): void {
    if (this.videoElement) {
      this.videoElement.style.width = `${window.innerWidth}px`;
      this.videoElement.style.height = `${window.innerHeight}px`;
    }
  }

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

  private loadHlsSource(url: string): void {
    this.hls?.loadSource(url);
    this.hls?.attachMedia(this.videoElement!);
  }

  private loadNativeSource(url: string): void {
    if (this.videoElement) this.videoElement.src = url;
  }
}
