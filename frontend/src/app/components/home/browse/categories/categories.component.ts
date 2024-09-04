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

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements AfterViewInit {
  @Input() movies: any[] = [];
  @Input() currentMovie: number = 0;
  @Input() favoriteMovies: any[] = [];
  @Output() currentMovieId = new EventEmitter<number>();

  environmentBaseUrl: string = environment.baseUrl;
  isScrollable: boolean = false;

  filmGenres = [
    { code: 'action', name: 'Action' },
    { code: 'adventure', name: 'Adventure' },
    { code: 'comedy', name: 'Comedy' },
    { code: 'drama', name: 'Drama' },
    { code: 'horror', name: 'Horror' },
    { code: 'science_fiction', name: 'Science Fiction' },
    { code: 'fantasy', name: 'Fantasy' },
    { code: 'romance', name: 'Romance' },
    { code: 'thriller', name: 'Thriller' },
    { code: 'mystery', name: 'Mystery' },
    { code: 'crime', name: 'Crime' },
    { code: 'animation', name: 'Animation' },
    { code: 'documentary', name: 'Documentary' },
    { code: 'musical', name: 'Musical' },
    { code: 'war', name: 'War' },
    { code: 'western', name: 'Western' },
    { code: 'other', name: 'Miscellaneous' },
  ];

  ngAfterViewInit() {
    this.checkScroll();
  }

  openCurrentMovie(movieId: number) {
    this.currentMovie = movieId;
    this.currentMovieId.emit(movieId);
  }

  allMovies(filmGenre: string) {
    return this.movies.filter((movie) => movie.film_genre === filmGenre);
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

  getThumbnailUrl(movieId: number, fileName: string): string {
    return `${environment.baseUrl}/media/thumbnails/${movieId}/${fileName}_480p.jpg`;
  }

  // Category scroll

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

  scrollLeft(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const container = button
      .closest('.category')
      ?.querySelector('.movies') as HTMLElement;
    if (container) {
      container.scrollLeft -= 217;
    }
  }

  scrollRight(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const container = button
      .closest('.category')
      ?.querySelector('.movies') as HTMLElement;
    if (container) {
      container.scrollLeft += 217;
    }
  }
}
