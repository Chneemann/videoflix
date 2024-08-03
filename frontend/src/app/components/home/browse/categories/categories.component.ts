import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @Input() movies: any[] = [];
  @Output() currentMovieId = new EventEmitter<number>();

  openCurrentMovie(movieId: number) {
    this.currentMovieId.emit(movieId);
  }

  get documentaryMovies() {
    return this.movies.filter((movie) => movie.category === 'documentary');
  }
}
