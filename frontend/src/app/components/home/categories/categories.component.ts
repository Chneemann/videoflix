import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MoviesListComponent } from './movie-list/movie-list.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, MoviesListComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements AfterViewInit {
  @Input() movies: any[] = [];
  @Input() currentMovie: number = 0;
  @Input() favoriteMovies: any[] = [];
  @Input() watchedMovies: any[] = [];
  @Output() currentMovieId = new EventEmitter<number>();

  environmentBaseUrl: string = environment.baseUrl;
  isScrollable: boolean = false;

  filmGenres = [
    { code: 'action', name: 'Action' },
    { code: 'adventure', name: 'Adventure' },
    { code: 'animation', name: 'Animation' },
    { code: 'anime', name: 'Anime' },
    { code: 'comedy', name: 'Comedy' },
    { code: 'crime', name: 'Crime' },
    { code: 'documentary', name: 'Documentary' },
    { code: 'drama', name: 'Drama' },
    { code: 'fantasy', name: 'Fantasy' },
    { code: 'horror', name: 'Horror' },
    { code: 'musical', name: 'Musical' },
    { code: 'mystery', name: 'Mystery' },
    { code: 'other', name: 'Miscellaneous' },
    { code: 'romance', name: 'Romance' },
    { code: 'science_fiction', name: 'Science Fiction' },
    { code: 'thriller', name: 'Thriller' },
    { code: 'war', name: 'War' },
    { code: 'western', name: 'Western' },
  ];

  ngAfterViewInit() {
    this.checkScroll();
  }

  openCurrentMovie(movieId: number) {
    this.currentMovie = movieId;
    this.currentMovieId.emit(movieId);
  }

  getAllMovies(filmGenre: string) {
    return this.movies.filter((movie) => movie.film_genre === filmGenre);
  }

  getFavoriteMovies() {
    return this.movies.filter((movie) =>
      this.favoriteMovies.includes(movie.id)
    );
  }

  recentMovies() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    return this.movies.filter((movie) => {
      const movieDate = new Date(movie.created_at);
      return movieDate >= lastMonday && movieDate <= today;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScroll();
  }

  checkScroll() {
    const containers = document.querySelectorAll(
      '.movies'
    ) as NodeListOf<HTMLElement>;
    containers.forEach((container) => {
      const scrollButtons = container.parentElement?.querySelector(
        '.scroll-buttons'
      ) as HTMLElement;
      if (container && scrollButtons) {
        if (container.scrollWidth > container.clientWidth) {
          scrollButtons.classList.add('show');
        } else {
          scrollButtons.classList.remove('show');
        }
      }
    });
  }
}
