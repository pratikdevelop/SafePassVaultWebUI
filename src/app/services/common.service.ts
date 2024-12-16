import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as yaml from 'js-yaml'; // Import YAML parser
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  sideBarOpen = new BehaviorSubject<any>(false);
  profileSideBarOpen = new BehaviorSubject<any>(false);
  readonly http = inject(HttpClient)

  constructor() { }

  toggleSideBar(): void {
    this.sideBarOpen.next(!this.sideBarOpen.value);
  }
  toggleProfileSideBar(): void {
    this.profileSideBarOpen.next(!this.profileSideBarOpen.value);
  }
  getAPIDocs(): Observable<any> {
    return this.http.get('swagger.json', { responseType: 'text' }).pipe(map(yamlContent => {
      const parsedData = yaml.load(yamlContent); // Parse YAML content
      return parsedData;
    }));
  }

  getAllTagsByType(type: string): Observable<any> {
    return this.http.get(`${environment.api_url}/tags/${type}`).pipe(map(response => {
      return response
    }));
  }
  searchTags(name: string, type: string): Observable<any> {
    // Validate and sanitize inputs
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid name parameter');
    }
    const sanitizedName = encodeURIComponent(name.trim());
    return this.http.get(`${environment.api_url}/tags/search/${type}/${sanitizedName}`);
  }

  createTicket(formData: any): Observable<any> {
    return this.http.post(`${environment.api_url}/tickets`, formData);
  }
}
