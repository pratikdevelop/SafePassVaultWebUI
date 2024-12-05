import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private http: HttpClient,
  ) { }



  getLogs(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/audit')
  }
}
