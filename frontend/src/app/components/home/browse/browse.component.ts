import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { AuthService } from '../../../services/auth.service';
import { MovieService } from '../../../services/movie.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { BtnSmallComponent } from '../../../shared/components/buttons/btn-small/btn-small.component';
import { UploadMovieComponent } from './upload-movie/upload-movie.component';

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
  currentMovie: any[] = [];
  playMovie: string = '';
  uploadMovieOverview: boolean = false;
  currentResolution: '480p' | '720p' | '1080p' = '720p';
  movieIsUploaded: { [resolution: string]: boolean } = {
    '480': false,
    '720': false,
    '1080': false,
  };

  constructor(
    private authService: AuthService,
    private movieService: MovieService
  ) {}

  async ngOnInit() {
    await this.loadAllMovies();
    this.currentMovie.length === 0 ? this.loadRandomMovie() : null;
  }

  onMovieIsUploadedChange(newStatus: { [resolution: string]: boolean }) {
    this.movieIsUploaded = newStatus;
  }

  changeResolution(resolution: '480p' | '720p' | '1080p') {
    if (this.videoPlayer) {
      this.videoPlayer.switchResolution(resolution);
      this.currentResolution = resolution;
    }
  }

  async loadAllMovies() {
    this.movies = await this.movieService.getAllMovies();
  }

  closeVideo(): void {
    this.playMovie = '';
  }

  playVideo(videoPath: string) {
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
