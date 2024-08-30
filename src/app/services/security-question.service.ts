import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionService {

  private apiUrl = `${environment.api_url}/security-questions`;  // Your API URL

  constructor(private http: HttpClient) { }

  // Create a new security question
  createSecurityQuestion(formValues: any): Observable<any> {
    return this.http.post(this.apiUrl, formValues);
  }

  // Get all security questions for a user
  getSecurityQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Update a security question
  updateSecurityQuestion(id: string, question: string, answer: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { question, answer });
  }

  // Delete a security question
  deleteSecurityQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
