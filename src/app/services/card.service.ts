import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrl = `${environment.api_url}/cards`; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Create a new card
  createCard(card: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, card)
      .pipe(catchError(this.handleError));
  }

  // Get all cards
  getCards(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get a specific card by ID
  getCardById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update a card by ID
  updateCard(id: string, card: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, card)
      .pipe(catchError(this.handleError));
  }

  // Delete a card by ID
  deleteCard(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  exportCardsASCsv(ids: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/export?ids=${ids}`, { responseType: 'blob' });
  }
  addToFavorites(cardIds: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cardIds}/favorite`, {}); // Assuming no additional data is sent in the request body
  }

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  searchTags(name: string): Observable<any> {
    return this.http.get(`${environment.api_url}/tags/search/${name}`);
  }

  addTag(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/tags/tag`, payload);
  }

  addTagToPassword(passwordId: string, tagName: string): Observable<any> {
    const body = { passwordId, tagName };
    return this.http.post(`${this.apiUrl}/add-tag`, body);
  }
}
