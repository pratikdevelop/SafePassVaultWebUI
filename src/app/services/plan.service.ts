import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl: string = `${environment.api_url}/plans`;
  plan = [
    {
      id: 'null',
      title: 'Free Plan',
      amount: 0,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
     
    },
    {
      id: 'P-6XR17625JV867584NM3WGF7I',
      title: 'Premium Plan (yearly)',
      amount: 60,
      currency: 'USD',
      interval: 'year',
      intervalCount: 1,
     
    },
    {
      id: 'P-5GV04444VF2894031M3VR2MY',
      title: 'Premium Plan (Monthly)',
      amount: 6,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
    },
    {
      id: 'P-93233881XJ483274HM3WGPGA',
      title: 'Basic Plan (Yearly)',
      amount: 40,
      currency: 'USD',
      interval: 'year',
      intervalCount: 1,
    },
    {
      id: 'P-85R761525X622673PM3WGOTQ',
      title: 'Basic Plan (Monthly)',
      amount: 4,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
     
    },
    {
      id: 'P-683760842Y234025BM3WGQ6Y',
      title: 'Enterprise Plan (Yearly)',
      amount: 100,
      currency: 'USD',
      interval: 'year',
      intervalCount: 1,
    },
    {
      id: 'P-959072281U895714BM3WGQCA',
      title: 'Enterprise Plan (Monthly)',
      amount: 10,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
    },
  ];
  constructor(private http: HttpClient) {}

  // Fetch all plans
  getPlans(): Observable<any> {
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
