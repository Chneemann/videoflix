import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { MovieService } from '../../../services/movie.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { BtnSmallComponent } from '../../../shared/components/buttons/btn-small/btn-small.component';
import { UploadMovieComponent } from './upload-movie/upload-movie.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroBannerComponent,
    CategoriesComponent,
    VideoPlayerComponent,
    BtnSmallComponent,
    UploadMovieComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  @ViewChild(VideoPlayerComponent) videoPlayer!: VideoPlayerComponent;
  movies: any[] = [];
  favoriteMovies: number[] = [];
  watchedMovies: number[] = [];
  currentMovie: any[] = [];
  playMovie: string = '';
  isLoading: boolean = true;
  isWideScreen: boolean = false;
  uploadMovieOverview: boolean = false;
  currentResolution: '360p' | '720p' | '1080p' = '720p';
  movieIsUploaded: { [resolution: string]: boolean } = {
    '360': false,
    '720': false,
    '1080': false,
  };

  constructor(
    private movieService: MovieService,
    public userService: UserService
  ) {}

  async ngOnInit() {
    this.loadLikedAndWatchedMovies();
    await this.loadAllMovies();
    if (this.checkScreenWidth()) {
      this.currentMovie.length === 0 ? this.loadRandomMovie() : null;
    }
  }

  async loadLikedAndWatchedMovies() {
    try {
      const userData = await this.userService.getLikedAndWatchedMovies();
      this.favoriteMovies = userData.liked_videos;
      this.watchedMovies = userData.watched_videos;
    } catch (error) {
      console.error(error);
    }
  }

  updateLikeMovies() {
    const body = {
      liked_videos: this.favoriteMovies,
    };
    this.userService.updateLikedMovies(body);
  }

  onRefreshPage(updatedMovies: any[]) {
    this.currentMovie = [];
    setTimeout(() => {
      this.currentMovie = updatedMovies;
    }, 1);
  }

  onMoviesChange(updatedMovies: any[]) {
    if (this.checkScreenWidth()) {
      this.loadRandomMovie();
    } else {
      this.currentMovie = updatedMovies;
    }
  }

  checkScreenWidth() {
    return (this.isWideScreen = window.innerWidth > 600);
  }

  onMovieIsUploadedChange(newStatus: { [resolution: string]: boolean }) {
    this.movieIsUploaded = newStatus;
  }

  onFavoriteMovieChange(favoriteMovies: any) {
    this.favoriteMovies = favoriteMovies;
    this.updateLikeMovies();
  }

  changeResolution(resolution: '360p' | '720p' | '1080p') {
    if (this.videoPlayer && this.movieIsUploaded[resolution.replace('p', '')]) {
      this.videoPlayer.switchResolution(resolution);
      this.currentResolution = resolution;
    }
  }

  async loadAllMovies() {
    this.isLoading = true;
    try {
      this.movies = await this.movieService.getAllMovies();
    } finally {
      this.isLoading = false;
    }
  }

  closeVideo(): void {
    this.playMovie = '';
  }

  playVideo(videoPath: string) {
    this.currentResolution = '720p';
    this.playMovie = videoPath;
  }

  loadRandomMovie(): void {
    const randomIndex = Math.floor(Math.random() * this.movies.length);
    this.currentMovie = [this.movies[randomIndex]];
  }

  currentMovieId(movieId: number) {
    let index = this.movies.findIndex((movie) => movie.id === movieId);
    if (index !== -1) {
      this.currentMovie = [];
      this.currentMovie.push(this.movies[index]);
    }
  }

  toggleUploadMovieOverview(value: any) {
    this.uploadMovieOverview = value;
  }
}
