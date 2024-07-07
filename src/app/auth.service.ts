import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, catchError, tap, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
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

  emailVerification(OTPForm: any): Observable<any> {
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
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email }).pipe(tap((response: any) => {
      return of(response)
    }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        // Optionally handle the error differently based on your needs
        return throwError(error);
      }))
  }

  verifYResetRequest(id: string, token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify-reset-link?id=${id}&toekn=${token}`,).pipe(tap((response: any) => {
      return of(response)
    }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        // Optionally handle the error differently based on your needs
        return throwError(error);
      }))
  }

  changePassword(passowrd: any, id: any): Observable<any> {
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

  login(loginFormValue: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/login`, loginFormValue)
      .pipe(
        switchMap((response: any) => {
          return of(response);
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getProfile(): Observable<any> {

    // Assuming authorization header with token for authenticated profile access
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers })
      .pipe(
        switchMap(response => { return of(response) }), // You might want to process the profile data here
        catchError(error => {
          return throwError(error);
        })
      );
  }

  logout(): Observable<any> {
    // Assuming authorization header with token for authenticated profile access
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }) // Some APIs might require an empty payload for logout
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  resendCode(email: string) : Observable<any> {
    return this.http.get(`${this.apiUrl}/resend-code/${email}`) // Some APIs might require an empty payload for logout
    .pipe(switchMap((response) => {
        return of(response);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
