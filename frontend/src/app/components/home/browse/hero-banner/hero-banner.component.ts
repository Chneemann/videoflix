import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BtnLargeComponent } from '../../../../shared/components/btn-large/btn-large.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent {
  @Input() currentMovie: any[] = [];

  getImagePath(): string {
    return `./../../../../../assets/movies/banner/${this.currentMovie[0]?.imgPath}`;
  }
}
