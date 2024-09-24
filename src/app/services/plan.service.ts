import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl: string = `${environment.api_url}/plans`;

  constructor(private http: HttpClient) {}

  // Fetch all Stripe plans
  getStripePlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Fetch a specific plan by ID
  getPlanById(planId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${planId}`).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Create a new subscription plan
  createPlan(planDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-subscriptions`, planDetails).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Update an existing plan by ID
  updatePlan(planId: string, planDetails: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${planId}`, planDetails).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Delete a specific plan by ID
  deletePlan(planId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${planId}`).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // Handle errors with detailed logging
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    // Check if it's a client-side or network error
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code: ${error.status}, error message: ${error.message}`;
    }

    // Log the error to the console or send it to logging infrastructure
    console.error(errorMessage);

    // Throw the error so it can be caught in components using this service
    return throwError(() => new Error(errorMessage));
  }
}
