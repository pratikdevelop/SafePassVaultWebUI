// home/pc-02/Music/password-app/src/app/password.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = 'http://52.91.240.97/api/passwords';
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem("token")
  });

  constructor(private http: HttpClient) { }
  getPasswords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.headers })
      .pipe(
        switchMap((response: any[]) => {
          // Validate response data structure (optional)
          if (!Array.isArray(response) || !response.every((item) => item.password && item.key)) {
            return throwError(new Error('Invalid password data format'));
          }
  
          // Decrypt passwords securely
          const decryptedPasswords = response.map((res) => {
            try {
              const decryptedPassword = CryptoJS.AES.decrypt(res.password, res.key).toString(CryptoJS.enc.Utf8);
              return { ...res, password: decryptedPassword };
            } catch (err) {
              console.error('Error decrypting password:', err);
              return throwError(new Error('Failed to decrypt password')); // Handle individual decryption errors
            }
          });
  
          return of(decryptedPasswords);
        }),
        catchError((error: any) => {
          console.error('Error fetching or decrypting passwords:', error); // Log comprehensive error
          return throwError(error); // Re-throw the error for proper handling
        })
      );
  }
  
  

  addPassword(password: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password`, password, { headers: this.headers })
    .pipe(
      switchMap((response: any) => { // Use switchMap to transform the entire response
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

  deletePassword(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/password/${id}`, { headers: this.headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting password:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }

  updatePassword(_id: any, newPasswordObject: { website: any; username: any; password: string; key: string; }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/password/${_id}`, newPasswordObject, { headers: this.headers })
      .pipe(
        switchMap((response: any) => { // Use switchMap to transform the entire response
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

  sharePassword(passwordId: string): Observable<{ shareLink: string }> {
    return this.http.post<{ shareLink: string }>(`${this.apiUrl}/share/${passwordId}`,{}, { headers: this.headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error generating share link:', error);
          throw error; // Re-throw the error to prevent silent failures
        })
      );
  }
}
