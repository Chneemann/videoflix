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
import { firstValueFrom, timeInterval } from 'rxjs';

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

  private readonly PLAYBACK_SPEED = 0.5;

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
   * Lifecycle hook called when the component's input properties have changed.
   * Updates the video details if the current video has changed.
   * @param changes The changes to the component's input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentVideo']) {
      this.updateVideoDetails(this.currentVideo);
    }
  }

  /**
   * Updates the video details, resolution status, and playback speed
   * for the hero banner component based on the given video.
   * @param video The video to update the hero banner component with.
   */
  private updateVideoDetails(video: Video | null): void {
    if (video) {
      const videoId = video.id;
      this.loadVideoResolutionStatus(videoId);
      this.updateVideoUrls();
      this.setVideoSpeed();
    }
  }

  /**
   * Loads the resolution status of the video.
   */
  private loadVideoResolutionStatus(videoId: number): void {
    firstValueFrom(this.videoService.isVideoResolutionUploaded(videoId))
      .then((resolutions) => {
        this.videoIsUploaded = resolutions;
        this.videoIsUploadedChange.emit(this.videoIsUploaded);
      })
      .catch((error) => {
        console.error('Error loading the video resolution:', error);
      });
  }

  /**
   * Updates the URLs for the video, thumbnail, and preview clip
   * based on the current video. Sets the appropriate media paths
   * for the video player and displays.
   */
  private updateVideoUrls(): void {
    if (this.currentVideo) {
      const { id, file_name } = this.currentVideo;
      this.videoUrl = this.getVideoMediaPath('video', id, file_name);
      this.thumbnailUrl = this.getVideoMediaPath('thumbnail', id, file_name);
      this.previewClipUrl = this.getVideoMediaPath('preview', id, file_name);
    }
  }

  /**
   * Generates a URL for a video, thumbnail, or preview clip given the type, id, and file name.
   * @param type The type of media to generate the URL for.
   * @param id The id of the video.
   * @param file The file name of the video.
   * @returns A URL pointing to the desired media.
   */
  private getVideoMediaPath(
    type: 'video' | 'thumbnail' | 'preview',
    id: number,
    file: string
  ): string {
    switch (type) {
      case 'video':
        return `${this.environmentBaseUrl}/media/videos/${id}/${file}`;
      case 'thumbnail':
        return `${this.environmentBaseUrl}/media/thumbnails/${id}/${file}_1080p.jpg`;
      case 'preview':
        return `${this.environmentBaseUrl}/media/thumbnails/${id}/${file}_preview-clip.mp4`;
    }
  }

  /**
   * Sets the playback rate of the video.
   */
  private setVideoSpeed(): void {
    setInterval(() => {
      const videoElement = this.videoElementRef?.nativeElement;
      if (videoElement) {
        videoElement.playbackRate = this.PLAYBACK_SPEED;
      }
    });
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
   * Plays the video and marks it as watched.
   */
  playVideoId(videoPath: string, video: Video): void {
    this.playVideo.emit(videoPath);
    this.toggleVideoStatus(video.id, 'watched');
  }

  /**
   * Toggles the status of a video (favorite or watched) and emits the updated
   * favoriteVideos or watchedVideos array.
   * @param videoId The id of the video to toggle the status for.
   * @param statusType The type of status to toggle ('favorite' or 'watched').
   */
  toggleVideoStatus(videoId: number, statusType: 'favorite' | 'watched'): void {
    if (statusType === 'favorite') {
      this.favoriteVideos = this.toggleArrayItem(this.favoriteVideos, videoId);
      this.favoriteVideoChange.emit(this.favoriteVideos);
    } else if (statusType === 'watched') {
      if (!this.watchedVideos.includes(videoId)) {
        this.watchedVideos = [...this.watchedVideos, videoId];
        this.watchedVideoChange.emit(this.watchedVideos);
      }
    }
  }

  /**
   * Toggles the presence of an item in an array, returning a new array.
   *
   * @param array The array to modify.
   * @param id The item to toggle.
   * @returns A new array with the item toggled.
   */
  private toggleArrayItem(array: number[], id: number): number[] {
    return array.includes(id)
      ? array.filter((item) => item !== id)
      : [...array, id];
  }

  /**
   * Checks if the video is marked as a favorite.
   */
  checkLikeVideos(video: Video): boolean {
    return video.id !== undefined && this.favoriteVideos.includes(video.id);
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
   * Checks if any of the video resolutions are available to watch.
   */
  get isAnyResolutionAvailable(): boolean {
    return Object.values(this.videoIsUploaded).some((available) => available);
  }
}
