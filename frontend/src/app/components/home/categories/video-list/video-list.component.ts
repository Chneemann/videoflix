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

  getThumbnailUrl(videoId: number | undefined, fileName: string): string {
    const id = videoId ?? 0;
    return `${environment.baseUrl}/media/thumbnails/${id}/${fileName}_480p.jpg`;
  }

  openCurrentVideo(videoId: number | undefined) {
    if (videoId !== undefined) {
      const video = this.videos.find((v) => v.id === videoId);
      if (video) {
        this.currentVideo = video;
        this.currentVideoId.emit(videoId);
      }
    }
  }

  scrollLeft(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const container = button
      .closest('.category')
      ?.querySelector('.videos') as HTMLElement;
    if (container) {
      container.scrollLeft -= 217;
    }
  }

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
