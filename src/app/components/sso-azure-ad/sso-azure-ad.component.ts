import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sso-azure-ad',
  standalone: true,
  imports: [],
  templateUrl: './sso-azure-ad.component.html',
  styleUrl: './sso-azure-ad.component.css'
})
export class SsoAzureAdComponent {

  azureSettings = {
    clientId: '',
    tenantId: '',
    redirectUri: '',
    clientSecret: ''
  };

  constructor(private http: HttpClient) { }

  saveAzureADSettings() {
    this.http.post('/api/sso/azure-ad', this.azureSettings).subscribe(
      (response) => {
        alert('Azure AD settings saved successfully');
      },
      (error) => {
        console.error('Error saving Azure AD settings:', error);
        alert('Failed to save Azure AD settings');
      }
    );
  }
}
