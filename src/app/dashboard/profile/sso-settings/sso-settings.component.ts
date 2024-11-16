import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../services/common.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SSOSettingsService } from '../../../services/ssosettings.service';

@Component({
  selector: 'app-sso-settings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sso-settings.component.html',
  styleUrls: ['./sso-settings.component.css']
})
export class SsoSettingsComponent {
  private readonly commonService = inject(CommonService);
  private readonly ssoSettingsService = inject(SSOSettingsService);
  message!: string;

  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
  ssoProviders = [
    { id: 'azure-ad', name: 'Azure AD', fields: ['redirectUrl', 'clientId', 'tenantId', 'secret', 'secretExpiry'] },
    { id: 'google', name: 'Google', fields: ['redirectUrl', 'clientId', 'secret', 'secretExpiry', 'scopes'] },
    { id: 'facebook', name: 'Facebook', fields: ['redirectUrl', 'clientId', 'secret', 'scopes'] },
    { id: 'saml', name: 'SAML', fields: ['loginUrl', 'redirectUrl', 'clientId', 'secret'] }
  ];

  selectedProvider = this.ssoProviders[0]; // Default selected provider
  ssoSettings: any = {}; // Dynamic settings based on selected provider

  constructor() { }

  // Method to switch between SSO providers
  selectProvider(provider: { id: string; name: string; fields: string[]; }) {
    this.selectedProvider = provider;
    this.ssoSettings = {}; // Clear settings when switching providers
  }

  // Method to save settings (could be used to send data to a backend)
  saveSettings() {

    this.ssoSettingsService.saveSettings(this.ssoSettings).subscribe(
      (response) => {
        this.message = 'Settings saved successfully!';
        console.log('Saved:', response);
      },
      (error) => {
        this.message = 'Failed to save settings.';
        console.error('Error:', error);
      }
    );
  }
}
