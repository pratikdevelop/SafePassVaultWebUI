import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ssooauth2',
  standalone: true,
  imports: [],
  templateUrl: './ssooauth2.component.html',
  styleUrl: './ssooauth2.component.css'
})
export class SSOOAuth2Component {
  oauth2Settings = { clientId: '', clientSecret: '', authorizationUrl: '', tokenUrl: '', redirectUri: '' };

  constructor(private http: HttpClient) { }

  saveOAuth2Settings() {
    this.http.post('/api/sso-settings/oauth2', this.oauth2Settings).subscribe(response => {
      alert('OAuth 2.0 settings saved successfully');
    }, error => {
      alert('Failed to save OAuth 2.0 settings');
    });
  }
}
