import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sso-settings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatIconModule],
  templateUrl: './sso-settings.component.html',
  styleUrl: './sso-settings.component.css'
})
export class SsoSettingsComponent {
  ssoSettings = {
    loginUrl: '',
    redirectUrl: '',
    clientId: '',
    tenantId: '',
    secret: '',
    secretExpiry: ''
  };

  saveSettings() {
    // Here you can send the ssoSettings object to your backend API
    console.log('SSO Settings Saved:', this.ssoSettings);
  }
}
