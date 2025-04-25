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

  /**
   * Listens to the errorText$ observable and updates the component's errorText
   * property with the latest error message.
   */
  ngOnInit(): void {
    this.errorService.errorText$.subscribe((message: string) => {
      this.errorText = message;
    });
  }

  /**
   * Stops the propagation of an event to prevent the component from closing
   * when the user clicks on the error message.
   * @param event The MouseEvent to stop propagating.
   */
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * Clears the current error message from the error service when the user clicks
   * anywhere outside the error toast.
   */
  closeError() {
    this.errorService.clearError();
  }
}
