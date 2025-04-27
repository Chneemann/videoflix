import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * Initializes the ApiService with HttpClient and TokenService.
   */
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /**
   * Sends a GET request to the specified endpoint.
   *
   * @template T The expected type of the response.
   * @param endpoint The API endpoint to send the request to.
   * @param auth Whether to include authentication headers. Defaults to false.
   * @returns An Observable of type T.
   */
  get<T>(endpoint: string, auth: boolean = false): Observable<T> {
    const headers = auth ? { headers: this.getAuthHeaders() } : {};
    return this.http
      .get<T>(`${environment.baseUrl}${endpoint}`, headers)
      .pipe(catchError(this.handleError));
  }

  /**
   * Sends a POST request to the specified endpoint with a request body.
   *
   * @template T The expected type of the response.
   * @param endpoint The API endpoint to send the request to.
   * @param body The request payload to send.
   * @param auth Whether to include authentication headers. Defaults to false.
   * @returns An Observable of type T.
   */
  post<T>(endpoint: string, body: any, auth: boolean = false): Observable<T> {
    const headers = auth ? { headers: this.getAuthHeaders() } : {};
    return this.http
      .post<T>(`${environment.baseUrl}${endpoint}`, body, headers)
      .pipe(catchError(this.handleError));
  }

  /**
   * Sends a PUT request to the specified endpoint with a request body.
   *
   * @template T The expected type of the response.
   * @param endpoint The API endpoint to send the request to.
   * @param body The request payload to update.
   * @param auth Whether to include authentication headers. Defaults to false.
   * @returns An Observable of type T.
   */
  put<T>(endpoint: string, body: any, auth: boolean = false): Observable<T> {
    const headers = auth ? { headers: this.getAuthHeaders() } : {};
    return this.http
      .put<T>(`${environment.baseUrl}${endpoint}`, body, headers)
      .pipe(catchError(this.handleError));
  }

  /**
   * Generates HTTP headers containing the Authorization token.
   * If no token is found, the session is cleared.
   *
   * @returns A set of HTTP headers including the Authorization token.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    if (!token) {
      this.tokenService.clearSession();
    }
    return new HttpHeaders({ Authorization: `Token ${token}` });
  }

  /**
   * Handles HTTP request errors by logging them and returning a throwError observable.
   *
   * @param error The error object received from the HTTP request.
   * @returns An observable that emits the error.
   */
  private handleError(error: any) {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
