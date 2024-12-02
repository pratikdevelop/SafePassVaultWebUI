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
}
