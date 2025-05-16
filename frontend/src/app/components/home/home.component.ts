import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { VideoService } from '../../services/video.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { BtnSmallComponent } from '../../shared/components/buttons/btn-small/btn-small.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UserService } from '../../services/user.service';
import { ResolutionService } from '../../services/resolution.service';
import { Video } from '../../interfaces/video.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroBannerComponent,
    CategoriesComponent,
    VideoPlayerComponent,
    BtnSmallComponent,
    UploadVideoComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild(VideoPlayerComponent) videoPlayer!: VideoPlayerComponent;

  videos: Video[] = [];
  currentVideo: Video | null = null;
  favoriteVideos: number[] = [];
  watchedVideos: number[] = [];

  playVideo: string = '';
  isLoading: boolean = true;
  uploadVideoOverview: boolean = false;

  availableResolutions: string[];
  currentResolution: string;
  videoIsUploaded: { [resolution: string]: boolean };

  private readonly SCREEN_WIDTH_THRESHOLD = 600;

  /**
   * Initializes the HomeComponent with the VideoService, UserService and ResolutionService.
   * Get the available resolutions, current resolution, and video upload status.
   */
  constructor(
    private videoService: VideoService,
    public userService: UserService,
    private resolutionService: ResolutionService
  ) {
    this.availableResolutions =
      this.resolutionService.getAvailableResolutions();
    this.currentResolution = this.resolutionService.getDefaultResolution();
    this.videoIsUploaded = this.resolutionService.initVideoIsUploaded();
  }

  /**
   * Lifecycle hook: Called once the component is initialized.
   * Initializes the component by loading user data and videos.
   */
  async ngOnInit(): Promise<void> {
    await this.initializeComponent();
  }

  /**
   * Determines whether the screen is considered wide.
   */
  get isWideScreenView(): boolean {
    return window.innerWidth > this.SCREEN_WIDTH_THRESHOLD;
  }

  /**
   * Initializes the component by loading user data and videos.
   */
  private async initializeComponent(): Promise<void> {
    await this.fetchAllVideos();
    await this.loadUserVideoPreferences();
    this.autoSelectRandomVideoIfWideScreen();
  }

  /**
   * Fetches all available videos from the server.
   */
  private async fetchAllVideos(): Promise<void> {
    this.isLoading = true;
    try {
      this.videos = await this.videoService.getAllVideos();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Loads the user's liked and watched video IDs.
   */
  private async loadUserVideoPreferences(): Promise<void> {
    try {
      const { liked_videos, watched_videos } =
        await this.userService.getUserVideoPreferences();
      this.favoriteVideos = liked_videos;
      this.watchedVideos = watched_videos;
    } catch (error) {
      console.error('Failed to load user video preferences:', error);
    }
  }

  /**
   * Automatically selects a random video if screen is wide and no video is selected.
   */
  private autoSelectRandomVideoIfWideScreen(): void {
    if (this.isWideScreenView && !this.currentVideo) {
      this.selectRandomVideoAsCurrent();
    }
  }

  /**
   * Called when favorite videos change.
   */
  onFavoriteVideoChange(favorites: number[]): void {
    this.favoriteVideos = favorites;
    this.updateLikedVideos();
  }

  /**
   * Called when watched videos change.
   */
  onWatchedVideoChange(watched: number[]): void {
    this.watchedVideos = watched;
    this.updateWatchedVideos();
  }

  /**
   * Updates user's watched videos in the backend.
   */
  private updateWatchedVideos(): void {
    const body = { watched_videos: this.watchedVideos };
    this.userService.updateWatchedVideos(body);
  }

  /**
   * Updates user's liked videos in the backend.
   */
  private updateLikedVideos(): void {
    const body = {
      liked_videos: this.favoriteVideos,
    };
    this.userService.updateLikedVideos(body);
  }

  /**
   * Updates current video after refresh.
   */
  onRefreshPage(updatedVideos: Video[] | undefined): void {
    this.currentVideo = null;
    setTimeout(() => {
      this.currentVideo =
        updatedVideos && updatedVideos.length > 0 ? updatedVideos[0] : null;
    }, 0);
  }

  /**
   * Called when the video list changes.
   */
  onVideosChange(updatedVideos: Video[]): void {
    if (this.isWideScreenView) {
      this.selectRandomVideoAsCurrent();
    } else {
      this.currentVideo = updatedVideos[0] || null;
    }
  }

  /**
   * Called after a video upload is completed.
   */
  onVideoUploaded(video: Video): void {
    this.currentVideo = null;
    setTimeout(() => {
      this.currentVideo = video;
      this.videos.push(video);
    }, 1);
  }

  /**
   * Handles resolution switching.
   */
  changeResolution(resolution: string): void {
    if (this.videoPlayer && this.videoIsUploaded[resolution]) {
      this.videoPlayer.switchResolution(resolution);
      this.currentResolution = resolution;
    }
  }

  /**
   * Checks if any resolution is unavailable.
   */
  isAnyResolutionUnavailable(): boolean {
    return this.availableResolutions.some(
      (resolution) => !this.videoIsUploaded[resolution]
    );
  }

  /**
   * Sets the current video to the given video ID.
   */
  openCurrentVideo(video: Video): void {
    this.currentVideo = video;
  }

  /**
   * Selects a random video from the list as current video.
   */
  private selectRandomVideoAsCurrent(): void {
    const randomIndex = Math.floor(Math.random() * this.videos.length);
    this.currentVideo = this.videos[randomIndex] || null;
  }

  /**
   * Plays a video by path and sets resolution to default.
   */
  playVideoPath(videoPath: string): void {
    this.currentResolution = this.resolutionService.getDefaultResolution();
    this.playVideo = videoPath;
  }

  /**
   * Closes the currently playing video.
   */
  closeVideo(): void {
    this.playVideo = '';
  }

  /**
   * Updates the state of uploaded resolutions.
   */
  onVideoIsUploadedChange(newStatus: { [resolution: string]: boolean }): void {
    this.videoIsUploaded = newStatus;
  }

  /**
   * Toggles the upload video UI overview.
   */
  toggleUploadVideoOverview(value: boolean): void {
    this.uploadVideoOverview = value;
  }

  /**
   * Listens for window resize events and triggers the screen size check.
   *
   * @param event The resize event triggered when the window is resized.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  /**
   * Checks the screen size and selects a random video if wide screen and no video is selected.
   */
  private checkScreenSize(): void {
    if (this.isWideScreenView && !this.currentVideo) {
      this.selectRandomVideoAsCurrent();
    }
  }
}
