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
  @Input() favoriteVideos: number[] = [];
  @Input() watchedVideos: number[] = [];

  @Output() videoSelected = new EventEmitter<Video>();

  environmentBaseUrl: string = environment.baseUrl;
  isScrollable: boolean = false;

  genres$ = this.genreService.getGenres();

  /**
   * Initializes the CategoriesComponent with the GenreService.
   */
  constructor(private genreService: GenreService) {}

  /**
   * Lifecycle hook called after the view has been initialized.
   * Calls `checkScroll()` to evaluate if scrolling buttons should be shown.
   */
  ngAfterViewInit(): void {
    this.checkScroll();
  }

  /**
   * Opens a specific video by its ID and emits the video ID through the event emitter.
   *
   * @param videoId The ID of the video to be opened
   */
  openCurrentVideo(video: Video): void {
    this.currentVideo = video;
    this.videoSelected.emit(video);
  }

  /**
   * Filters and returns all videos of a specific genre.
   *
   * @param genre The genre of videos to filter by
   * @returns An array of videos belonging to the specified genre
   */
  getAllVideos(genre: string): Video[] {
    return this.videos.filter((video) => video.genre === genre);
  }

  /**
   * Filters and returns all favorite videos.
   *
   * @returns An array of favorite videos
   */
  getFavoriteVideos(): Video[] {
    return this.videos.filter(
      (video) =>
        video.id !== undefined && this.favoriteVideos.includes(video.id)
    );
  }

  /**
   * Filters and returns all videos that have been created in the last week (from Monday to today).
   *
   * @returns An array of videos created in the past week
   */
  recentVideos(): Video[] {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    return this.videos.filter((video) => {
      const videoDate = new Date(video.created_at);
      return videoDate >= lastMonday && videoDate <= today;
    });
  }

  /**
   * Event listener for window resize to check scrollable status and adjust the UI.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.checkScroll();
  }

  /**
   * Checks whether the videos container is scrollable and displays or hides the scroll buttons accordingly.
   */
  checkScroll(): void {
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
