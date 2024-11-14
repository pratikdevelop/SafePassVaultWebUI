import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Observable,
  switchMap,
  of,
  catchError,
  tap,
  throwError,
  map,
  BehaviorSubject,
} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = `${environment.api_url}/auth`;
  readonly http = inject(HttpClient);
  public _userProfileSubject = new BehaviorSubject<any | null>(null);
  public userProfile$: Observable<any | null> =
    this._userProfileSubject.asObservable();

  signup(signupForm: any): Observable<any[]> {
    return this.http.post<any>(`${this.apiUrl}/register`, signupForm).pipe(
      tap((response: any) => {
        return of(response);
      }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        return throwError(error);
      })
    );
  }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Send POST request to the backend
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  emailVerification(OTPForm: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirm-email`, OTPForm).pipe(
      tap((response: any) => {
        return of(response);
      }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        // Optionally handle the error differently based on your needs
        return throwError(error);
      })
    );
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email }).pipe(
      tap((response: any) => {
        return of(response);
      }),
      catchError((error: any) => {
        console.error('Error fetching passwords:', error);
        // Optionally handle the error differently based on your needs
        return throwError(error);
      })
    );
  }

  verifYResetRequest(id: string, token: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/verify-reset-link?id=${id}&token=${token}`)
      .pipe(
        tap((response: any) => {
          return of(response);
        }),
        catchError((error: any) => {
          console.error('Error fetching passwords:', error);
          // Optionally handle the error differently based on your needs
          return throwError(error);
        })
      );
  }

  changePassword(passowrd: any, id: any): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/change-password/${id}`, passowrd)
      .pipe(
        map((response: any) => {
          // Handle successful password reset response data
          return response;
        }),
        tap(() => console.log('Password reset successful')), // Log success message
        catchError((error: { message: any; }) => {
          // Handle error response
          return of({
            error: error.message || 'An error occurred during password reset.',
          });
        })
      );
  }

  login(loginFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginFormValue).pipe(
      switchMap((response: any) => {
        return of(response);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      switchMap((response: any) => {
        this._userProfileSubject.next(response);
        return of(response);
      }), // You might want to process the profile data here
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    // Assuming authorization header with token for authenticated profile access
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { headers }) // Some APIs might require an empty payload for logout
      .pipe(
        map((response: any) => {
          // Handle successful logout response data
          this._userProfileSubject.next(null);
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
  passwordReset(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  verifyMFA(mfaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-mfa`, mfaData);
  }

  setup2FA(email: string): Observable<{ imageUrl: string }> {
    console.log('email', email);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/setup-2fa`, {
      email,
    });
  }

  // Verify 2FA token entered by the user
  verify2FA(email: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-2fa`, { email, token });
  }

  resendCode(email: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/resend-code/${email}`) // Some APIs might require an empty payload for logout
      .pipe(
        switchMap((response: any) => {
          return of(response);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  updateMfaSettings(settings: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mfa-settings`, settings).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getPlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/plans`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  resendInvitation(
    organizationId: string,
    recipientId: string
  ): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/resend-invitation/${organizationId}/${recipientId}`,
        {}
      )
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, profile).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  requestLogin(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-magic-link`, { email });
  }
  verifyMagicLink(token: string) {
    return this.http.get<{ token: string }>(`${this.apiUrl}/magic-link`, {
      params: { token }
    });
  }
  resendMagicLink(email: string) {
    return this.http.post(`${this.apiUrl}/resend-magic-link`, { email });
  }

  recoverAccount(key?: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover-account`, { key }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
