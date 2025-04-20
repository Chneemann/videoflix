import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MoviesListComponent {
  @Input() movies: any[] = [];
  @Input() currentMovie: number = 0;
  @Input() watchedMovies: any[] = [];
  @Input() movieCategory: string = '';
  @Output() currentMovieId = new EventEmitter<number>();

  getThumbnailUrl(movieId: number, fileName: string): string {
    return `${environment.baseUrl}/media/thumbnails/${movieId}/${fileName}_480p.jpg`;
  }

  openCurrentMovie(movieId: number) {
    this.currentMovie = movieId;
    this.currentMovieId.emit(movieId);
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
