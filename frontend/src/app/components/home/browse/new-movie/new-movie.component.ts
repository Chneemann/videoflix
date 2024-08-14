import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-movie',
  standalone: true,
  imports: [],
  templateUrl: './new-movie.component.html',
  styleUrl: './new-movie.component.scss',
})
export class NewMovieComponent {
  @Output() toggleNewMovieOverview = new EventEmitter<boolean>();

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  newMovieOverview() {
    this.toggleNewMovieOverview.emit(false);
  }
}
