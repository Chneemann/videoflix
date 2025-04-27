import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<string>('');
  errorText$ = this.errorSubject.asObservable();

  displayError = false;

  /**
   * Sets a new error message and enables error display.
   *
   * @param message The error message to display.
   */
  errorMsg(message: string) {
    this.errorSubject.next(message);
    this.displayError = true;
  }

  /**
   * Clears the current error message and hides the error display.
   */
  clearError() {
    this.errorSubject.next('');
    this.displayError = false;
  }

  /**
   * Handles an unknown or HTTP error, setting an appropriate error message.
   *
   * @param error The error object to process.
   */
  handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      const errorMessage = error.error.error || 'An unknown error occurred';
      this.errorMsg(errorMessage);
    } else {
      this.errorMsg('An unexpected error occurred');
    }
  }
}
