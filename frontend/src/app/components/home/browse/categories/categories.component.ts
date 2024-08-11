import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @Input() movies: any[] = [];
  @Input() currentMovie: number = 0;
  @Output() currentMovieId = new EventEmitter<number>();

  environmentBaseUrl: string = environment.baseUrl.slice(0, -1);

  filmGenres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Horror',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Thriller',
    'Mystery',
    'Crime',
    'Animation',
    'Documentary',
    'Musical',
    'War',
    'Western',
  ];

  openCurrentMovie(movieId: number) {
    this.currentMovie = movieId;
    this.currentMovieId.emit(movieId);
  }

  allMovies(filmGenre: string) {
    return this.movies.filter((movie) => movie.film_genre === filmGenre);
  }

  recentMovies() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return this.movies.filter((movie) => {
      const movieDate = new Date(movie.create);
      return movieDate >= sevenDaysAgo;
    });
  }
}
