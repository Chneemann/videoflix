import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Input,
  HostListener,
} from '@angular/core';
import videojs from 'video.js';
import log from 'video.js/dist/types/utils/log';

@Component({
  selector: 'app-video-player',
  standalone: true,
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() playMovie: string = '';
  private player: any;
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.updateScreenDimensions();
    this.player = videojs(
      this.elementRef.nativeElement.querySelector('video'),
      {
        controls: true,
        autoplay: true,
        height: this.screenHeight,
        width: this.screenWidth,
        preload: 'auto',
        sources: [
          {
            src: this.playMovie,
            type: 'application/x-mpegURL',
          },
        ],
      }
    );
  }

  private updateScreenDimensions() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
