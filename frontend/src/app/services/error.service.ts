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

  errorMsg(message: string) {
    this.errorSubject.next(message);
    this.displayError = true;
  }

  clearError() {
    this.errorSubject.next('');
    this.displayError = false;
  }

  handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      const errorMessage = error.error.error || 'An unknown error occurred';
      this.errorMsg(errorMessage);
    } else {
      this.errorMsg('An unexpected error occurred');
    }
  }
}
