import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
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

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.videoElement = this.elementRef.nativeElement.querySelector(
      'video'
    ) as HTMLVideoElement;

    if (this.playMovie) {
      this.resolutionUrls = {
        '480p': `${this.playMovie}_480p.m3u8`,
        '720p': `${this.playMovie}_720p.m3u8`,
        '1080p': `${this.playMovie}_1080p.m3u8`,
      };

      if (Hls.isSupported() && this.videoElement) {
        this.hls = new Hls();
        this.hls.loadSource(this.resolutionUrls['720p']); // Default resolution
        this.hls.attachMedia(this.videoElement);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.videoElement?.play();
        });
      } else if (
        this.videoElement.canPlayType('application/vnd.apple.mpegurl')
      ) {
        this.videoElement.src = this.resolutionUrls['720p']; // Default resolution
        this.videoElement.addEventListener('canplay', () => {
          this.videoElement?.play();
        });
      }

      this.updateScreenDimensions();
    } else {
      console.error('playMovie is not set.');
    }
  }

  private updateScreenDimensions() {
    if (this.videoElement) {
      this.videoElement.style.width = `${window.innerWidth}px`;
      this.videoElement.style.height = `${window.innerHeight}px`;
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  // Method to switch resolution
  public switchResolution(resolution: '480p' | '720p' | '1080p') {
    if (this.resolutionUrls[resolution]) {
      if (this.hls) {
        this.hls.loadSource(this.resolutionUrls[resolution]);
        this.hls.attachMedia(this.videoElement!);
      } else if (this.videoElement) {
        this.videoElement.src = this.resolutionUrls[resolution];
      }
    } else {
      console.error(`Resolution URL for ${resolution} not found.`);
    }
  }
}
