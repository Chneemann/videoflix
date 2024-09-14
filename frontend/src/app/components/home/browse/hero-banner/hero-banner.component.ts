import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
import { MovieService } from '../../../../services/movie.service';
import { environment } from '../../../../../environments/environment';
import { BtnSmallComponent } from '../../../../shared/components/buttons/btn-small/btn-small.component';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, BtnSmallComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent implements OnChanges {
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;
  @Input() currentMovie: any[] = [];
  @Input() screenWidth: boolean = false;
  @Input() favoriteMovies: any[] = [];
  @Input() watchedMovies: any[] = [];
  @Output() playMovie = new EventEmitter<string>();
  @Output() movieIsUploadedChange = new EventEmitter<{
    [resolution: string]: boolean;
  }>();
  @Output() refreshChange = new EventEmitter<any[]>();
  @Output() moviesChange = new EventEmitter<any[]>();
  @Output() favoriteMovieChange = new EventEmitter<any[]>();

  isVideoLoaded: boolean = false;
  videoUrl: string = '';
  thumbnailUrl: string = '';
  playUrl: string = '';
  environmentBaseUrl: string = environment.baseUrl;
  movieIsUploaded: { [resolution: string]: boolean } = {
    '320': true,
    '720': true,
    '1080': true,
  };
  constructor(
    private movieService: MovieService,
    public userService: UserService
  ) {}

  ngAfterViewInit() {
    this.videoSpeed();
  }

  onVideoLoad() {
    this.isVideoLoaded = true;
  }

  onVideoError() {
    this.isVideoLoaded = false;
  }

  getVideoUrls() {
    this.playUrl = `${this.environmentBaseUrl}/media/videos/${this.currentMovie[0]?.id}/${this.currentMovie[0]?.file_name}`;
    this.videoUrl = `${this.environmentBaseUrl}/media/thumbnails/${this.currentMovie[0]?.id}/${this.currentMovie[0]?.file_name}_video-thumbnail.mp4`;
    this.thumbnailUrl = `${this.environmentBaseUrl}/media/thumbnails/${this.currentMovie[0]?.id}/${this.currentMovie[0]?.file_name}_1080p.jpg`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentMovie'] && this.currentMovie.length > 0) {
      const movieId = this.currentMovie[0]?.id;
      if (movieId) {
        this.movieService
          .isMovieResolutionUploaded(movieId)
          .subscribe((resolutions) => {
            this.movieIsUploaded = resolutions;
            this.movieIsUploadedChange.emit(this.movieIsUploaded);
          });
        setTimeout(() => this.videoSpeed(), 0);
        this.getVideoUrls();
      }
    }
  }

  videoSpeed() {
    if (this.videoElementRef) {
      const videoElement = this.videoElementRef.nativeElement;
      videoElement.playbackRate = 0.5;
    }
  }

  toggleLikeMovie(movieId: number): void {
    if (this.favoriteMovies.includes(movieId)) {
      this.favoriteMovies = this.favoriteMovies.filter((id) => id !== movieId);
    } else {
      this.favoriteMovies.push(movieId);
    }
    this.favoriteMovieChange.emit(this.favoriteMovies);
  }

  toggleWatchedMovie(movieId: number): void {
    if (this.watchedMovies.includes(movieId)) {
      this.watchedMovies = this.watchedMovies.filter((id) => id !== movieId);
    } else {
      this.watchedMovies.push(movieId);
    }
    this.updateWatchedMovies();
  }

  updateWatchedMovies() {
    const body = {
      watched_videos: this.watchedMovies,
    };
    this.userService.updateWatchedMovies(body);
  }

  checkLikeMovies(videoId: number) {
    return this.favoriteMovies.includes(videoId);
  }

  isAnyResolutionUploaded(): boolean {
    return (
      this.movieIsUploaded['320'] ||
      this.movieIsUploaded['720'] ||
      this.movieIsUploaded['1080']
    );
  }

  refreshPage(newMovies: any[]) {
    this.refreshChange.emit(newMovies);
  }

  backToCategory(newMovies: any[]) {
    this.moviesChange.emit(newMovies);
  }

  playMovieId(videoPath: string, videoId: number) {
    this.playMovie.emit(videoPath);
    this.toggleWatchedMovie(videoId);
  }
}
