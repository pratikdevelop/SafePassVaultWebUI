import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProofIdService {

  private apiUrl = `${environment.api_url}/proofIds`; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Create a new proof ID
  createProofId(proofId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, proofId)
      .pipe(catchError(this.handleError));
  }

  // Get all proof IDs
  getProofIds(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get a specific proof ID by ID
  getProofIdById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update a proof ID by ID
  updateProofId(id: string, proofId: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, proofId)
      .pipe(catchError(this.handleError));
  }

  // Delete a proof ID by ID
  deleteProofId(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
