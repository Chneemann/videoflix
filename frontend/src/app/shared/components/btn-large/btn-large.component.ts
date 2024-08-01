import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-large',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-large.component.html',
  styleUrl: './btn-large.component.scss',
})
export class BtnLargeComponent {
  @Input() type: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
}
