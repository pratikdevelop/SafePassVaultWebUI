import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { Q } from '@angular/cdk/keycodes';
@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private apiUrl = `${environment[`api_url`]}/passwords`;
  readonly http = inject(HttpClient);
  public filteredPasswords$: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);

  getPasswords(_search?: string, queryparams?: any): Observable<any[]> {
    const params = this.createHttpParams(_search, queryparams);

    return this.http.get<any>(`${this.apiUrl}`, { params }).pipe(
      switchMap((response) => this.decryptPasswords(response.passwords)),
      catchError((error) => {
        console.error('Error fetching or decrypting passwords:', error);
        return throwError(error); // Re-throw the error for proper handling
      })
    );
  }

  // Helper function to create HttpParams
  private createHttpParams(_search?: string, queryparams?: any): HttpParams {
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

  // Helper function to decrypt passwords
  private decryptPasswords(passwords: any[]): Observable<any[]> {
    const decryptedPasswords = passwords.map((res) => {
      try {
        const decryptedPassword = CryptoJS.AES.decrypt(
          res.password,
          res.key
        ).toString(CryptoJS.enc.Utf8);
        return { ...res, password: decryptedPassword };
      } catch (err) {
        console.error('Error decrypting password:', err);
        return throwError(new Error('Failed to decrypt password')); // Handle individual decryption errors
      }
    });

    this.filteredPasswords$.next(decryptedPasswords); // Initialize filteredPasswords$ with fetched data
    return of(decryptedPasswords);
  }

  addPassword(password: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password`, password).pipe(
      switchMap((response: any) => {
        // Use switchMap to transform the entire response
        const decryptedPassword = AES.decrypt(response.password, response.key);

        response.password = decryptedPassword.toString(CryptoJS.enc.Utf8);
        this.getPasswords();
        return of(response); // Return the modified password object
      }),
      catchError((error: any) => {
        console.error('Error updating password:', error);
        throw error; // Re-throw the error to prevent silent failures
      })
    );
  }

  deletePassword(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/password/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting password:', error);
        throw error; // Re-throw the error to prevent silent failures
      })
    );
  }

  deleteMultiplePasswords(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/password/${ids}`).pipe(
      catchError((error: any) => {
        console.error('Error deleting password:', error);
        throw error; // Re-throw the error to prevent silent failures
      })
    );
  }
  addToFavorites(passwordId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/${passwordId}/favorite`, {}); // Assuming no additional data is sent in the request body
  }

  updatePassword(
    _id: any,
    newPasswordObject: {
      website: any;
      username: any;
      password: string;
      key: string;
    }
  ): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/password/${_id}`, newPasswordObject)
      .pipe(
        switchMap((response: any) => {
          // Use switchMap to transform the entire response
          const decryptedPassword = AES.decrypt(
            response.password,
            response.key
          );

          response.password = decryptedPassword.toString(CryptoJS.enc.Utf8);
          return of(response); // Return the modified password object
        }),
        catchError((error: any) => {
          console.error('Error updating password:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }

  sharePassword(email: any): Observable<{ shareLink: string }> {
    return this.http
      .post<{ shareLink: string }>(`${this.apiUrl}/share/`, email)
      .pipe(
        catchError((error: any) => {
          console.error('Error generating share link:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }

  searchTags(name: string): Observable<any> {
    return this.http.get(`${environment.api_url}/tags/search/${name}`);
  }

  addTag(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.api_url}/tags/tag`, payload);
  }

  exportPasswordsAsCsv(ids: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/export?ids=${ids}`, {
      responseType: 'blob',
    });
  }
  addTagToPassword(passwordId: string, tagName: string): Observable<any> {
    const body = { passwordId, tagName };
    return this.http.post(`${this.apiUrl}/add-tag`, body);
  }
  // sharePassword(data: any): Observable<any> {
  //   return this.http.post(this.apiUrl, data, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }
  postComment(passwordId: string, content: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${passwordId}/comments`, { content })
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting password:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }
}
