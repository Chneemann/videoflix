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
  @Input() watchedVideos: number[] = [];

  @Output() videoSelected = new EventEmitter<number>();

  /**
   * Get the URL of the thumbnail image for the given videoId and fileName.
   * @param videoId The id of the video.
   * @param fileName The name of the video file.
   * @returns The URL of the thumbnail image.
   */
  getThumbnailUrl(videoId: number, fileName: string): string {
    return `${environment.baseUrl}/media/thumbnails/${videoId}/${fileName}_480p.jpg`;
  }

  /**
   * Sets the given video as the currently active video and emits its ID to the parent component.
   * @param videoId The ID of the video to be marked as current.
   */
  openCurrentVideo(videoId: number): void {
    const video = this.videos.find((v) => v.id === videoId);
    if (video) {
      this.currentVideo = video;
      this.videoSelected.emit(video.id);
    }
  }

  /**
   * Scrolls the video container to the left when the left scroll button is clicked.
   * @param event Mouse click event from the left scroll button.
   */
  scrollLeft(event: MouseEvent): void {
    this.scrollContainer(event, -217);
  }

  /**
   * Scrolls the video container to the right when the right scroll button is clicked.
   * @param event Mouse click event from the right scroll button.
   */
  scrollRight(event: MouseEvent): void {
    this.scrollContainer(event, 217);
  }

  /**
   * Adjusts the horizontal scroll position of the video container.
   * @param event Mouse event triggered by the scroll button.
   * @param offset Amount in pixels to scroll (positive for right, negative for left).
   */
  private scrollContainer(event: MouseEvent, offset: number): void {
    const button = event.target as HTMLElement;
    const container = button
      .closest('.category')
      ?.querySelector('.videos') as HTMLElement;
    if (container) {
      container.scrollLeft += offset;
    }
  }
}
