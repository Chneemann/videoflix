import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
import { MovieService } from '../../../../services/movie.service';
import { environment } from '../../../../environments/environment';
import { BtnSmallComponent } from '../../../../shared/components/buttons/btn-small/btn-small.component';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, BtnSmallComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {
  @Input() currentMovie: any[] = [];
  @Input() screenWidth: boolean = false;
  @Output() playMovie = new EventEmitter<string>();
  @Output() movieIsUploadedChange = new EventEmitter<{
    [resolution: string]: boolean;
  }>();
  @Output() moviesChange = new EventEmitter<any[]>();

  currentUserLikedCurrentMovie: boolean = false;
  environmentBaseUrl: string = environment.baseUrl;
  movieIsUploaded: { [resolution: string]: boolean } = {
    '480': false,
    '720': false,
    '1080': false,
  };
  constructor(
    private el: ElementRef,
    private movieService: MovieService,
    public userService: UserService
  ) {}

  async loadLikedMovies() {
    try {
      const likedMovies = await this.userService.getLikedMovies();
      this.currentUserLikedCurrentMovie = likedMovies.liked_videos.includes(
        this.currentMovie[0].id
      );
    } catch (error) {
      console.error(error);
    }
  }

  toggleLikeMovie(movieId: number) {
    this.currentUserLikedCurrentMovie = !this.currentUserLikedCurrentMovie;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentMovie'] && this.currentMovie.length > 0) {
      const movieId = this.currentMovie[0]?.id;
      this.loadLikedMovies();
      if (movieId) {
        this.movieService
          .isMovieResolutionUploaded(movieId)
          .subscribe((resolutions) => {
            this.movieIsUploaded = resolutions;
            this.movieIsUploadedChange.emit(this.movieIsUploaded);
          });
      }
    }
  }

  isAnyResolutionUploaded(): boolean {
    return (
      this.movieIsUploaded['480'] ||
      this.movieIsUploaded['720'] ||
      this.movieIsUploaded['1080']
    );
  }

  backToCategory(newMovies: any[]) {
    this.moviesChange.emit(newMovies);
  }

  playMovieId(videoPath: string) {
    this.playMovie.emit(videoPath);
  }
}
