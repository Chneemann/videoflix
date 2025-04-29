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
import { VideoListComponent } from './video-list/video-list.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, VideoListComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements AfterViewInit {
  @Input() videos: any[] = [];
  @Input() currentVideo: number = 0;
  @Input() favoriteVideos: any[] = [];
  @Input() watchedVideos: any[] = [];
  @Output() currentVideoId = new EventEmitter<number>();

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
