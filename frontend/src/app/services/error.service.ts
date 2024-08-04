import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ErrorDetail {
  type: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorDetail | null>(null);

  error$: Observable<{ [key: string]: string } | null> = this.errorSubject
    .asObservable()
    .pipe(
      map((errorDetail) => {
        if (errorDetail) {
          return { [errorDetail.type]: errorDetail.message };
        }
        return null;
      })
    );

  setError(type: string, message: string) {
    const errorDetail: ErrorDetail = { type, message };
    this.errorSubject.next(errorDetail);
  }

  clearError() {
    this.errorSubject.next(null);
  }
}
