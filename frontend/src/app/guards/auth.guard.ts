import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  /**
   * Initializes the AuthGuard with Router and AuthService.
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Determines if the route can be activated by checking if the user is authenticated.
   *
   * @returns An Observable, Promise, or boolean indicating whether the route can be activated.
   *          If the user is authenticated, returns true; otherwise, navigates to the root path and returns false.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkAuthUser().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
