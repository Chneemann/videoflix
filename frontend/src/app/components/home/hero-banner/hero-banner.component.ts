import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { VideoService } from '../../../services/video.service';
import { environment } from '../../../../environments/environment';
import { BtnSmallComponent } from '../../../shared/components/buttons/btn-small/btn-small.component';
import { UserService } from '../../../services/user.service';
import { ResolutionService } from '../../../services/resolution.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, BtnSmallComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent implements OnChanges {
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;
  @Input() currentVideo: any[] = [];
  @Input() isWideScreen: boolean = false;
  @Input() favoriteVideos: any[] = [];
  @Input() watchedVideos: any[] = [];
  @Output() playVideo = new EventEmitter<string>();
  @Output() videoIsUploadedChange = new EventEmitter<{
    [resolution: string]: boolean;
  }>();
  @Output() refreshChange = new EventEmitter<any[]>();
  @Output() videosChange = new EventEmitter<any[]>();
  @Output() favoriteVideoChange = new EventEmitter<any[]>();

  isVideoLoaded: boolean = false;
  videoUrl: string = '';
  thumbnailUrl: string = '';
  playUrl: string = '';
  environmentBaseUrl: string = environment.baseUrl;

  availableResolutions: string[];
  videoIsUploaded: { [resolution: string]: boolean };

  constructor(
    private videoService: VideoService,
    private resolutionService: ResolutionService,
    public userService: UserService
  ) {
    this.availableResolutions =
      this.resolutionService.getAvailableResolutions();
    this.videoIsUploaded = this.resolutionService.initVideoIsUploaded();
  }

  ngAfterViewInit() {
    this.videoSpeed();
  }

  onVideoLoad() {
    this.isVideoLoaded = true;
  }

  onVideoError() {
    this.isVideoLoaded = false;
  }

  getVideoUrls() {
    this.playUrl = `${this.environmentBaseUrl}/media/videos/${this.currentVideo[0]?.id}/${this.currentVideo[0]?.file_name}`;
    this.thumbnailUrl = `${this.environmentBaseUrl}/media/thumbnails/${this.currentVideo[0]?.id}/${this.currentVideo[0]?.file_name}_1080p.jpg`;
    this.videoUrl = `${this.environmentBaseUrl}/media/thumbnails/${this.currentVideo[0]?.id}/${this.currentVideo[0]?.file_name}_video-thumbnail.mp4`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentVideo'] && this.currentVideo.length > 0) {
      const videoId = this.currentVideo[0]?.id;
      if (videoId) {
        this.videoService
          .isVideoResolutionUploaded(videoId)
          .subscribe((resolutions) => {
            this.videoIsUploaded = resolutions;
            this.videoIsUploadedChange.emit(this.videoIsUploaded);
          });
        setTimeout(() => this.videoSpeed(), 0);
        this.getVideoUrls();
      }
    }
  }

  videoSpeed() {
    if (this.videoElementRef) {
      const videoElement = this.videoElementRef.nativeElement;
      videoElement.playbackRate = 0.5;
    }
  }

  toggleLikeVideo(videoId: number): void {
    if (this.favoriteVideos.includes(videoId)) {
      this.favoriteVideos = this.favoriteVideos.filter((id) => id !== videoId);
    } else {
      this.favoriteVideos.push(videoId);
    }
    this.favoriteVideoChange.emit(this.favoriteVideos);
  }

  toggleWatchedVideo(videoId: number): void {
    if (this.watchedVideos.includes(videoId)) {
      this.watchedVideos = this.watchedVideos.filter((id) => id !== videoId);
    } else {
      this.watchedVideos.push(videoId);
    }
    this.updateWatchedVideos();
  }

  updateWatchedVideos() {
    const body = {
      watched_videos: this.watchedVideos,
    };
    this.userService.updateWatchedVideos(body);
  }

  checkLikeVideos(videoId: number) {
    return this.favoriteVideos.includes(videoId);
  }

  isAnyResolutionAvailable(): boolean {
    return Object.values(this.videoIsUploaded).some((available) => available);
  }

  refreshPage(newVideos: any[]) {
    this.refreshChange.emit(newVideos);
  }

  backToCategory(newVideos: any[]) {
    this.videosChange.emit(newVideos);
  }

  playVideoId(videoPath: string, videoId: number) {
    this.playVideo.emit(videoPath);
    this.toggleWatchedVideo(videoId);
  }
}
