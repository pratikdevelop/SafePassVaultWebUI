import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, catchError, tap, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://44.206.224.230/api/auth';

  constructor(private http: HttpClient) { }

  signup(signupForm: any): Observable<any[]> {
    return this.http.post<any>(`${this.apiUrl}/register`, signupForm)
    .pipe(
      tap((response: any) => {
        return of(response)
      }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        // Optionally handle the error differently based on your needs
        return throwError(error);
      })
    );
  
  }

  emailVerification(OTPForm: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/confirm-email`, OTPForm)
    .pipe(
      tap((response: any) => {
        return of(response)
      }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        // Optionally handle the error differently based on your needs
        return throwError(error);
      })
    );
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {email}).pipe( tap((response: any) => {
      return of(response)
    }),
    catchError((error: any) => {
      console.error('Error fetching passwords:', error);
      // Optionally handle the error differently based on your needs
      return throwError(error);
    }))
  }
  verifYResetRequest(id: string, token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify-reset-link?id=${id}&toekn=${token}`,).pipe( tap((response: any) => {
      return of(response)
    }),
    catchError((error: any) => {
      console.error('Error fetching passwords:', error);
      // Optionally handle the error differently based on your needs
      return throwError(error);
    }))
  }
  changePassword(passowrd:any, id: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/change-password/${id}`, passowrd)
      .pipe(
        map((response: any) => {
          // Handle successful password reset response data
          return response;
        }),
        tap(() => console.log('Password reset successful')), // Log success message
        catchError(error => {
          // Handle error response
          return of({ error: error.message || 'An error occurred during password reset.' });
        })
      );
  }
 }
