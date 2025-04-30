import { Component, OnInit, ViewChild } from '@angular/core';
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
  videos: any[] = [];
  favoriteVideos: number[] = [];
  watchedVideos: number[] = [];
  currentVideo: any[] = [];
  playVideo: string = '';
  isLoading: boolean = true;
  uploadVideoOverview: boolean = false;

  availableResolutions: string[];
  currentResolution: string;
  videoIsUploaded: { [resolution: string]: boolean };

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

  async ngOnInit() {
    this.loadLikedAndWatchedVideos();
    await this.loadAllVideos();
    if (this.isWideScreen()) {
      this.currentVideo.length === 0 ? this.loadRandomVideo() : null;
    }
  }

  async loadLikedAndWatchedVideos() {
    try {
      const userData = await this.userService.getLikedAndWatchedVideos();
      this.favoriteVideos = userData.liked_videos;
      this.watchedVideos = userData.watched_videos;
    } catch (error) {
      console.error(error);
    }
  }

  updateLikeVideos() {
    const body = {
      liked_videos: this.favoriteVideos,
    };
    this.userService.updateLikedVideos(body);
  }

  onRefreshPage(updatedVideos: any[]) {
    this.currentVideo = [];
    setTimeout(() => {
      this.currentVideo = updatedVideos;
    }, 1);
  }

  onVideosChange(updatedVideos: any[]) {
    if (this.isWideScreen()) {
      this.loadRandomVideo();
    } else {
      this.currentVideo = updatedVideos;
    }
  }

  isWideScreen() {
    return window.innerWidth > 600;
  }

  onVideoIsUploadedChange(newStatus: { [resolution: string]: boolean }) {
    this.videoIsUploaded = newStatus;
  }

  onFavoriteVideoChange(favoriteVideos: any) {
    this.favoriteVideos = favoriteVideos;
    this.updateLikeVideos();
  }

  changeResolution(resolution: string) {
    if (this.videoPlayer && this.videoIsUploaded[resolution]) {
      this.videoPlayer.switchResolution(resolution);
      this.currentResolution = resolution;
    }
  }

  async loadAllVideos() {
    this.isLoading = true;
    try {
      this.videos = await this.videoService.getAllVideos();
    } finally {
      this.isLoading = false;
    }
  }

  closeVideo(): void {
    this.playVideo = '';
  }

  playVideoPath(videoPath: string) {
    this.currentResolution = '720p';
    this.playVideo = videoPath;
  }

  loadRandomVideo(): void {
    const randomIndex = Math.floor(Math.random() * this.videos.length);
    this.currentVideo = [this.videos[randomIndex]];
  }

  currentVideoId(videoId: number) {
    let index = this.videos.findIndex((video) => video.id === videoId);
    if (index !== -1) {
      this.currentVideo = [];
      this.currentVideo.push(this.videos[index]);
    }
  }

  isAnyResolutionUnavailable(): boolean {
    return this.availableResolutions.some(
      (resolution) => !this.videoIsUploaded[resolution]
    );
  }

  toggleUploadVideoOverview(value: any) {
    this.uploadVideoOverview = value;
  }
}
