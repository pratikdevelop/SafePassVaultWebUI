import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = `${environment[`api_url`]}/notes`;

  constructor(private http: HttpClient) { }

  // Create a new note card
  createNote(note: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/note`, note)
      .pipe(catchError(this.handleError));
  }

  // Get all note cards
  getNotes(searchTerm?: any, event?: any): Observable<any[]> {

    const params = this.createHttpParams(searchTerm, event)
    return this.http.get<any[]>(`${this.apiUrl}`, {params})
      .pipe(catchError(this.handleError));
  }

  // Get a note card by ID
  getNoteById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update a note card by ID
  updateNote(id: string, note: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, note)
      .pipe(catchError(this.handleError));
  }

  // Delete a note card by ID
  deleteNote(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  sharePassword(passwordId: string): Observable<{ shareLink: string }> {
    return this.http.post<{ shareLink: string }>(`${this.apiUrl}/share/${passwordId}`,{})
      .pipe(
        catchError((error: any) => {
          console.error('Error generating share link:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }

  exportNotesAsCsv(ids: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/export?ids=${ids}`, { responseType: 'blob' });
  }
  addToFavorites(noteId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/note/${noteId}/favorite`, {}); // Assuming no additional data is sent in the request body
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

  createHttpParams(_search?: string, queryparams?: any): HttpParams {
    let params = new HttpParams();
    if (queryparams) {
      Object.keys(queryparams).forEach((key) => {
        if (key === 'folderId') {
          params = params.set(key, queryparams[key].toString());
        } else {
          params = params.set('filter', queryparams[key]);
        }
      });
    }

    if (_search) {
      params = params.set('search', _search);
    }

    return params;
  }
}
