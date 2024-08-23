import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
})
export class ErrorToastComponent implements OnInit {
  errorText: string = '';

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.errorText$.subscribe((message: string) => {
      this.errorText = message;
    });
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  closeError() {
    this.errorService.clearError();
  }
}
