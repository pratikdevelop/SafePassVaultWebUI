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
    return this.http.post(`${this.apiUrl}/auth/organizations`, { name, description });
  }

  getOrganizations() {
    return this.http.get(`${this.apiUrl}/auth/organizations`);
  }

  sendInvitation(organizationId: string, recipientId: string) {
    return this.http.post(`${this.apiUrl}/auth/organizations/${organizationId}/invitations`, { recipientId });
  }

  getInvitations(userId: string) {
    return this.http.get(`${this.apiUrl}/auth/users/${userId}/invitations`);
  }

  updateInvitationStatus(invitationId: string, status: string) {
    return this.http.patch(`${this.apiUrl}/auth/invitations/${invitationId}`, { status });
  }

}