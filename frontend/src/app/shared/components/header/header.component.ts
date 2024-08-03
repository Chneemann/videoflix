import { Component, Input, input } from '@angular/core';
import { BtnLargeComponent } from '../btn-large/btn-large.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BtnLargeComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() browse: boolean = false;
}
