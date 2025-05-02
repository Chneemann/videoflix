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
import { Video } from '../../../interfaces/video.interface';
import { GenreService } from '../../../services/genre.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, VideoListComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements AfterViewInit {
  @Input() videos: Video[] = [];
  @Input() currentVideo: Video | null = null;
  @Input() favoriteVideos: any[] = [];
  @Input() watchedVideos: any[] = [];
  @Output() currentVideoId = new EventEmitter<number>();

  environmentBaseUrl: string = environment.baseUrl;
  isScrollable: boolean = false;

  genres$ = this.genreService.getGenres();

  constructor(private genreService: GenreService) {}

  ngAfterViewInit(): void {
    this.checkScroll();
  }

  openCurrentVideo(videoId: number) {
    const video = this.videos.find((v) => v.id === videoId);
    if (video) {
      this.currentVideo = video;
      this.currentVideoId.emit(videoId);
    }
  }

  getAllVideos(genre: string) {
    return this.videos.filter((video) => video.genre === genre);
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
