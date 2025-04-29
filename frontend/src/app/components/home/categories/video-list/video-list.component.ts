import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent {
  @Input() videos: any[] = [];
  @Input() currentVideo: number = 0;
  @Input() watchedVideos: any[] = [];
  @Input() videoCategory: string = '';
  @Output() currentVideoId = new EventEmitter<number>();

  getThumbnailUrl(videoId: number, fileName: string): string {
    return `${environment.baseUrl}/media/thumbnails/${videoId}/${fileName}_480p.jpg`;
  }

  openCurrentVideo(videoId: number) {
    this.currentVideo = videoId;
    this.currentVideoId.emit(videoId);
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
