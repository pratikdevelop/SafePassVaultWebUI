import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl: string = `${environment.api_url}/plans`;

  constructor(private http: HttpClient) {}

  getStipePlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(map((response) => response));
  }
  createPlan(planDetails: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/create-payment`, planDetails)
      .pipe(map((response) => response));
  }
}
