import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-small',
  standalone: true,
  imports: [],
  templateUrl: './btn-small.component.html',
  styleUrl: './btn-small.component.scss',
})
export class BtnSmallComponent {
  @Input() imgPath: string = '';
  @Input() disabled: boolean = false;
}
