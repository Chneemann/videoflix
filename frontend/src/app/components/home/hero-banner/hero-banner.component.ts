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
import { Video } from '../../../interfaces/video.interface';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, BtnSmallComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent implements OnChanges {
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;

  @Input() videos: Video[] = [];
  @Input() currentVideo: Video | null = null;
  @Input() isWideScreen: boolean = false;
  @Input() favoriteVideos: number[] = [];
  @Input() watchedVideos: number[] = [];

  @Output() playVideo = new EventEmitter<string>();
  @Output() videoIsUploadedChange = new EventEmitter<{
    [resolution: string]: boolean;
  }>();
  @Output() refreshChange = new EventEmitter<Video[]>();
  @Output() videosChange = new EventEmitter<Video[]>();
  @Output() favoriteVideoChange = new EventEmitter<number[]>();
  @Output() watchedVideoChange = new EventEmitter<number[]>();

  isVideoLoaded: boolean = false;
  previewClipUrl: string = '';
  thumbnailUrl: string = '';
  videoUrl: string = '';
  environmentBaseUrl: string = environment.baseUrl;

  availableResolutions: string[];
  videoIsUploaded: { [resolution: string]: boolean };

  /**
   * Initializes the HeroBannerComponent with the VideoService, ResolutionService and UserService.
   * Gets the available resolutions and video upload status.
   */
  constructor(
    private videoService: VideoService,
    private resolutionService: ResolutionService,
    public userService: UserService
  ) {
    this.availableResolutions =
      this.resolutionService.getAvailableResolutions();
    this.videoIsUploaded = this.resolutionService.initVideoIsUploaded();
  }

  /**
   * Lifecycle hook called after the view has been initialized.
   * Sets the playback rate of the video once the component is initialized.
   */
  ngAfterViewInit() {
    this.setVideoSpeed();
  }

  /**
   * Loads the resolution status of the video, sets the video speed and updates the video URLs.
   * @param changes SimpleChanges object containing the changed input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentVideo'] && this.currentVideo !== null) {
      const videoId = this.currentVideo.id;
      if (videoId) {
        this.loadVideoResolutionStatus(videoId);
        setTimeout(() => this.setVideoSpeed(), 0);
        this.updateVideoUrls();
      }
    }
  }

  /**
   * Updates the URLs for the video, thumbnail, and video thumbnail.
   */
  private updateVideoUrls(): void {
    if (this.currentVideo) {
      const videoId = this.currentVideo.id;
      const fileName = this.currentVideo.file_name;
      this.videoUrl = `${this.environmentBaseUrl}/media/videos/${videoId}/${fileName}`;
      this.thumbnailUrl = `${this.environmentBaseUrl}/media/thumbnails/${videoId}/${fileName}_1080p.jpg`;
      this.previewClipUrl = `${this.environmentBaseUrl}/media/thumbnails/${videoId}/${fileName}_preview-clip.mp4`;
    }
  }

  /**
   * Loads the resolution status of the video.
   */
  private loadVideoResolutionStatus(videoId: number): void {
    this.videoService
      .isVideoResolutionUploaded(videoId)
      .subscribe((resolutions) => {
        this.videoIsUploaded = resolutions;
        this.videoIsUploadedChange.emit(this.videoIsUploaded);
      });
  }

  /**
   * Sets the playback rate of the video.
   */
  private setVideoSpeed(): void {
    if (this.videoElementRef) {
      const videoElement = this.videoElementRef.nativeElement;
      videoElement.playbackRate = 0.5;
    }
  }

  /**
   * Called when the video has successfully loaded.
   */
  onVideoLoad(): void {
    this.isVideoLoaded = true;
  }

  /**
   * Called when an error occurs while loading the video.
   */
  onVideoError(): void {
    this.isVideoLoaded = false;
  }

  /**
   * Toggles the like status of the video.
   */
  toggleLikeVideo(video: Video): void {
    if (video.id !== undefined) {
      const videoId = video.id;
      this.favoriteVideos = this.favoriteVideos.includes(videoId)
        ? this.favoriteVideos.filter((id) => id !== videoId)
        : [...this.favoriteVideos, videoId];
      this.favoriteVideoChange.emit(this.favoriteVideos);
    }
  }

  /**
   * Toggles the watched status of the video.
   */
  toggleWatchedVideo(videoId: number): void {
    this.watchedVideos = this.watchedVideos.includes(videoId)
      ? this.watchedVideos.filter((id) => id !== videoId)
      : [...this.watchedVideos, videoId];
    this.watchedVideoChange.emit(this.watchedVideos);
  }

  /**
   * Checks if the video is marked as a favorite.
   */
  checkLikeVideos(video: Video): boolean {
    return video.id !== undefined && this.favoriteVideos.includes(video.id);
  }

  /**
   * Checks if any resolution is available.
   */
  isAnyResolutionAvailable(): boolean {
    return Object.values(this.videoIsUploaded).some((available) => available);
  }

  /**
   * Refreshes the page with the current video.
   */
  refreshPage(): void {
    this.refreshChange.emit(this.currentVideo ? [this.currentVideo] : []);
  }

  /**
   * Navigates back to the category list.
   */
  backToCategory(): void {
    this.videosChange.emit([]);
  }

  /**
   * Plays the video and marks it as watched.
   */
  playVideoId(videoPath: string, video: Video): void {
    if (video.id !== undefined) {
      this.playVideo.emit(videoPath);
      this.toggleWatchedVideo(video.id);
    }
  }
}
