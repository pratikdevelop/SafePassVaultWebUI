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
  from,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { startRegistration } from '@simplewebauthn/browser';




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
  verifyRecovery(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recovery-verify`, data);
  }
  generatePrivateKey(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/generate-private-key`, formData
    )
  }


  startBiometricRegistration(): Observable<any> {
    // Step 1: Get challenge from the server for WebAuthn using RxJS
    return this.http.get<{ challenge: string }>(`${this.apiUrl}/completeWebAuthRegisteration`).pipe(
      // Map the response to handle the challenge
      map((challengeResponse: any) => {
        const options = challengeResponse;
        return options
        // console.log(
        //   "Challenge received from the server for WebAuthn registration: ",
        //   challengeResponse
        // );

        // if (challengeResponse && challengeResponse.options) {
        //   // // Fix for URL-safe Base64 decoding
        //   // const challenge = new Uint8Array(
        //   //   atob(challengeResponse.challenge.replace(/-/g, '+').replace(/_/g, '/')).split('')
        //   //     .map((c) => c.charCodeAt(0))
        //   // );
        //   return challengeResponse.options;
        // } else {
        //   throw new Error('Challenge not received from server');
        // }
        // }),
        // Step 2: Configure WebAuthn options for fingerprint/face recognition
        // switchMap((options: any) => {
        /*const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
          challenge: challenge,
          rp: { name: 'Demo App' },
          user: {
            id: new TextEncoder().encode(email), // Use email as user ID
            name: email,
            displayName: name,
          },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: { authenticatorAttachment: 'platform' },
          timeout: 60000,
        };return from(
          navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions })).pipe(
          map((credential: any) => {
            console.log('Credential created successfully', credential);
            return credential;
          }),
          catchError((err) => {
            console.error('WebAuthn registration error:', err);
            throw new Error('WebAuthn registration failed');
          })
        );*/


      }),
      // Step 4: Send the registration data to the server for saving (including the webAuthnId)
      // switchMap((credential: PublicKeyCredential) => {
      //   console.log('Credential to send to server', credential);

      //   return this.http
      //     .post(`${this.apiUrl}/complete-webauth-register`, { credential })
      //     .pipe(
      //       map(() => {
      //         console.log('Biometric registration complete for ' + method);
      //       }),
      //       catchError((err) => {
      //         console.error('Error completing WebAuthn registration:', err);
      //         throw new Error('Error completing WebAuthn registration');
      //       })
      //     );
      // }),
      // Catch any errors from the entire stream
      catchError((err) => {
        console.error('Error in WebAuthn registration process:', err);
        throw new Error('WebAuthn registration process failed');
      })
    );
  }

  verifywebAuthentication(credential: PublicKeyCredential): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/complete-webauth-register`, { credential })
      .pipe(
        map(() => {
          return true
        }),
        catchError((err) => {
          console.error('Error completing WebAuthn registration:', err);
          throw new Error('Error completing WebAuthn registration');
        })
      );
  }


  startWebAuthnAuthentication(challange: string, credential: any): Observable<any> {
    // Convert challenge to a Uint8Array, handle URL-safe Base64
    // const challengeBuffer = new Uint8Array(
    //   atob('pOhGhZfwHxX5Dm5sh6c2Tyzbue/8EV1bVobjqANweME='.replace(/-/g, '+').replace(/_/g, '/')).split('')
    //     .map((c) => c.charCodeAt(0))
    // );

    // const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    //   challenge: challengeBuffer,
    //   allowCredentials: [], // Can be populated with stored credentials for the user
    //   timeout: 60000,
    // };

    // return new Observable((observer) => {
    // Get the credential from the user (biometric/fingerprint/face recognition)
    // navigator.credentials.get({ publicKey:  })
    //   .then((assertion: any) => {
    //     // Send the WebAuthn response to the server for verification
    //     this.http.post(`${this.apiUrl}/webauthn/complete-authenticate`, {
    //       credential: assertion,
    //       challenge: challenge, // Send the same challenge that was used for authentication
    //     }).subscribe(
    //       (response) => {
    //         observer.next(response);
    //         observer.complete();
    //       },
    //       (error) => {
    //         observer.error(error);
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     observer.error('WebAuthn authentication failed: ' + error);
    //   });
    // });

    return this.http.post(`${this.apiUrl}/webauthn/complete-authenticate`, {
      credential, challange
    }).pipe(map(
      (response) => {
        return response
      },
      () => {
        throw new Error('Error completing WebAuthn authentication');
      }
    ));
  }

  createWebAuthnCredential(options: any): Observable<any> {
    let authenticationResult;
    startRegistration({ ...options }).then((res) => {
      authenticationResult = res;
    })
    console.log(authenticationResult)
    return of(authenticationResult)

  }


  // generateRegistrationOptions(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/createWebAuthRegisteration`);
  // }

  // // Verify WebAuthn registration response with backend
  // completeWebAuthRegistration(credential: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/completeWebAuthRegisteration`, { credential });
  // }

  // // WebAuthn registration process
  // async register() {
  //   try {
  //     const options = await this.generateRegistrationOptions().toPromise();
  //     const attResp = await startRegistration(options);
  //     if (attResp) {
  //       const verification = await this.completeWebAuthRegistration(attResp);
  //       return verification;
  //     }
  //   } catch (error) {
  //     console.error('Error during registration:', error);
  //     throw error;
  //   }
  // }

  // // Generate WebAuthn authentication options from backend
  // generateAuthenticationOptions(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/generate-authentication-options`);
  // }

  // // Verify WebAuthn authentication response with backend
  // completeWebAuthnAuthentication(credential: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/completeWebAuthnAuthentication`, { credential });
  // }

  // // WebAuthn authentication process
  // async authenticate():  {
  //   try {
  //     const options = await this.generateAuthenticationOptions().toPromise();
  //     const authResp = await startAuthentication(options);
  //     if (authResp) {
  //       const verification = await this.completeWebAuthnAuthentication(authResp);
  //       return verification;
  //     }
  //   } catch (error) {
  //     console.error('Error during authentication:', error);
  //     throw error;
  //   }
  // }

}
