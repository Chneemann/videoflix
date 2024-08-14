import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { CategoriesComponent } from './categories/categories.component';
import { AuthService } from '../../../services/auth.service';
import { MovieService } from '../../../services/movie.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './vjs-player/vjs-player.component';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { BtnSmallComponent } from '../../../shared/components/buttons/btn-small/btn-small.component';
import { NewMovieComponent } from './new-movie/new-movie.component';

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
    NewMovieComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private authService: AuthService,
    private movieService: MovieService
  ) {}

  currentMovie: any[] = [];
  playMovie: string = '';
  newMovieOverview: boolean = false;

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

  toggleNewMovieOverview(value: any) {
    this.newMovieOverview = value;
  }
}
