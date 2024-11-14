import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ssosaml',
  standalone: true,
  imports: [],
  templateUrl: './ssosaml.component.html',
  styleUrl: './ssosaml.component.css'
})
export class SSOSamlComponent {

  samlSettings = { entryPoint: '', issuer: '', cert: '' };

  constructor(private http: HttpClient) { }

  saveSamlSettings() {
    this.http.post('/api/sso-settings/saml', this.samlSettings).subscribe(response => {
      alert('SAML settings saved successfully');
    }, error => {
      alert('Failed to save SAML settings');
    });
  }
}
