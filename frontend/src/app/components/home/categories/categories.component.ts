import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { VideoListComponent } from './video-list/video-list.component';
import { FilmGenre, GenreService } from '../../../services/genre.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, VideoListComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  @Input() videos: any[] = [];
  @Input() currentVideo: number = 0;
  @Input() favoriteVideos: any[] = [];
  @Input() watchedVideos: any[] = [];
  @Output() currentVideoId = new EventEmitter<number>();

  environmentBaseUrl: string = environment.baseUrl;
  isScrollable: boolean = false;
  filmGenres: FilmGenre[] = [];

  private destroy$ = new Subject<void>();

  constructor(private genreService: GenreService) {}

  ngOnInit(): void {
    this.getFilmGenreNames();
  }

  ngAfterViewInit(): void {
    this.checkScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilmGenreNames(): void {
    this.genreService
      .getGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe((genres) => {
        this.filmGenres = genres;
      });
  }

  openCurrentVideo(videoId: number) {
    this.currentVideo = videoId;
    this.currentVideoId.emit(videoId);
  }

  getAllVideos(filmGenre: string) {
    return this.videos.filter((video) => video.film_genre === filmGenre);
  }

  getFavoriteVideos() {
    return this.videos.filter((video) =>
      this.favoriteVideos.includes(video.id)
    );
  }

  recentVideos() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    return this.videos.filter((video) => {
      const videoDate = new Date(video.created_at);
      return videoDate >= lastMonday && videoDate <= today;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScroll();
  }

  checkScroll() {
    const containers = document.querySelectorAll(
      '.videos'
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
