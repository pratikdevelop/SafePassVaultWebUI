import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SSOSettingsService {
  private apiUrl = 'http://localhost:3000/api/sso-settings'; // Backend API URL

  constructor(private http: HttpClient) { }

  // Get all SSO settings
  getAllSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get specific SSO settings by provider
  getSettingsByProvider(provider: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${provider}`);
  }

  // Create or update SSO settings
  saveSettings(settings: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}`, settings, { headers });
  }

  // Delete SSO settings by provider
  deleteSettings(provider: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${provider}`);
  }
}
