import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-small',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-small.component.html',
  styleUrl: './btn-small.component.scss',
})
export class BtnSmallComponent {
  @Input() imgPath: string = '';
  @Input() btnRadius: string = '48px';
  @Input() imgRadius: string = '32px';
  @Input() disabled: boolean = false;
}
