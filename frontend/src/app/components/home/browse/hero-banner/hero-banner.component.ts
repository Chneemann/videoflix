import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BtnLargeComponent } from '../../../../shared/components/btn-large/btn-large.component';
import { MovieService } from '../../../../services/movie.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {
  @Input() currentMovie: any[] = [];
  @Output() playMovie = new EventEmitter<string>();

  environmentBaseUrl: string = environment.baseUrl.slice(0, -1);

  constructor(private el: ElementRef, private movieService: MovieService) {}

  playMovieId(videoPath: string) {
    this.playMovie.emit(videoPath);
  }

  getImagePath(): any {
    return '123';
  }
}
