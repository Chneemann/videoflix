import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
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

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.truncateText();
  }
  getImagePath(): string {
    return `./../../../../../assets/movies/banner/${this.currentMovie[0]?.imgPath}`;
  }

  truncateText() {
    const descriptionEl = this.el.nativeElement.querySelector('.description');
    const maxHeight = descriptionEl.offsetHeight;
    let text = descriptionEl.innerText;

    while (descriptionEl.scrollHeight > maxHeight) {
      text = text.slice(0, -1);
      descriptionEl.innerText = text + '...';
    }
  }
}
