import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { AuthService } from '../../../services/auth.service';
import { MovieService } from '../../../services/movie.service';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './vjs-player/vjs-player.component';
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
  movies: any[] = [];
  currentMovie: any[] = [];
  playMovie: string = '';
  uploadMovieOverview: boolean = false;

  constructor(
    private authService: AuthService,
    private movieService: MovieService
  ) {}

  async ngOnInit() {
    await this.loadAllMovies();
    this.currentMovie.length === 0 ? this.loadRandomMovie() : null;
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
    console.log(value);

    this.uploadMovieOverview = value;
  }
}
