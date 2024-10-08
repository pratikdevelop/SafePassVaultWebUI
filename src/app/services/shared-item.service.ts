import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SharedItemService {
  private apiUrl = `${environment.api_url}/share/share-item`; // Update with your API URL

  constructor(private http: HttpClient) { }

  shareItem(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
