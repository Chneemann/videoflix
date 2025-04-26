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
    if (this.hls) {
      this.hls.destroy();
    }
  }

  private initializePlayer(): void {
    this.videoElement = this.elementRef.nativeElement.querySelector(
      'video'
    ) as HTMLVideoElement;

    if (!this.playMovie) {
      console.error('playMovie is not set.');
      return;
    }

    this.resolutionUrls = Object.fromEntries(
      this.resolutionService
        .getAvailableResolutions()
        .map((res) => [res, `${this.playMovie}_${res}.m3u8`])
    );

    const defaultUrl = this.resolutionUrls[this.defaultResolution];

    if (Hls.isSupported() && this.videoElement) {
      this.hls = new Hls();
      this.hls.loadSource(defaultUrl);
      this.hls.attachMedia(this.videoElement);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoElement?.play();
      });
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = defaultUrl;
      this.videoElement.addEventListener('canplay', () => {
        this.videoElement?.play();
      });
    }

    this.updateScreenDimensions();
  }

  private updateScreenDimensions() {
    if (this.videoElement) {
      this.videoElement.style.width = `${window.innerWidth}px`;
      this.videoElement.style.height = `${window.innerHeight}px`;
    }
  }

  public switchResolution(resolution: string) {
    const targetUrl =
      this.resolutionUrls[resolution] ||
      this.resolutionUrls[this.defaultResolution];

    if (targetUrl) {
      if (this.hls) {
        this.hls.loadSource(targetUrl);
        this.hls.attachMedia(this.videoElement!);
      } else if (this.videoElement) {
        this.videoElement.src = targetUrl;
      }
    } else {
      console.error(`No URL found for resolution '${resolution}' or fallback.`);
    }
  }
}
