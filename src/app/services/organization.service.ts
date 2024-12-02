import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  createOrganization(name: any, description: any) {
    return this.http.post(`${this.apiUrl}/auth/organization`, { name, description });
  }
  getOrganization(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/organization/${id}`);
  }

  updateOrganization(id: any, formValue: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/organization/${id}`, formValue)
  }
  getOrganizations() {
    return this.http.get(`${this.apiUrl}/auth/organizations`);
  }

  sendInvitation(organizationId: string,  userForm: any) {
    return this.http.post(`${this.apiUrl}/auth/organizations/${organizationId}/invitations`, userForm );
  }

  getInvitations() {
    return this.http.get(`${this.apiUrl}/auth/users`);
  }

  updateInvitationStatus(invitationId: string, passowrd: string, email: string) {
   return this.http.post(`${this.apiUrl}/auth/accept-invitation`, { invitationId: invitationId, passowrd, email })
  }
  deleteOrganization(organizationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/organization/${organizationId}`);
    }

}