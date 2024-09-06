import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  createOrganization(name: any, description: any) {
    return this.http.post(`${this.apiUrl}/auth/organization`, { name, description });
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

}