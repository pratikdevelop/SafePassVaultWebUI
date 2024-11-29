import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  private apiUrl = 'http://localhost:3000/api/secrets';

  constructor(private http: HttpClient) { }

  // Create a new secret (API key, credential, etc.)
  createSecret(secret: { name: string, value: string, type: string, description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, secret);
  }

  // Retrieve all secrets (with decrypted values)
  getSecrets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
}



