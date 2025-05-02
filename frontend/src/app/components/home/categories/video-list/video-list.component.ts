import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Video } from '../../../../interfaces/video.interface';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent {
  @Input() videos: Video[] = [];
  @Input() currentVideo: Video | null = null;
  @Input() watchedVideos: any[] = [];
  @Input() videoCategory: string = '';
  @Output() currentVideoId = new EventEmitter<number>();

  /**
   * Get the URL of the thumbnail image for the given videoId and fileName.
   * @param videoId The id of the video.
   * @param fileName The name of the video file.
   * @returns The URL of the thumbnail image.
   */
  getThumbnailUrl(videoId: number | undefined, fileName: string): string {
    const id = videoId ?? 0;
    return `${environment.baseUrl}/media/thumbnails/${id}/${fileName}_480p.jpg`;
  }

  /**
   * Set the current video based on the given videoId and emit the videoId.
   * @param videoId The id of the video to set as the current video.
   */
  openCurrentVideo(videoId: number | undefined) {
    if (videoId !== undefined) {
      const video = this.videos.find((v) => v.id === videoId);
      if (video) {
        this.currentVideo = video;
        this.currentVideoId.emit(videoId);
      }
    }
  }

  /**
   * Scrolls the video container to the left by a fixed amount when the scroll-left button is clicked.
   * @param event The mouse event triggered by clicking the scroll-left button.
   */
  scrollLeft(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const container = button
      .closest('.category')
      ?.querySelector('.videos') as HTMLElement;
    if (container) {
      container.scrollLeft -= 217;
    }
  }

  /**
   * Scrolls the video container to the right by a fixed amount when the scroll-right button is clicked.
   * @param event The mouse event triggered by clicking the scroll-right button.
   */
  scrollRight(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const container = button
      .closest('.category')
      ?.querySelector('.videos') as HTMLElement;
    if (container) {
      container.scrollLeft += 217;
    }
  }
}
