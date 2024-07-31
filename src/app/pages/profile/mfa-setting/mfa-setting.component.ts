import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-mfa-setting',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, CommonModule, MatSelectModule, 
    MatOptionModule, ReactiveFormsModule, FormsModule, MatButtonModule, 
    MatSliderModule, MatSlideToggleModule
  ],
  templateUrl: './mfa-setting.component.html',
  styleUrl: './mfa-setting.component.css'
})
export class MfaSettingComponent {
  mfaForm = new FormGroup({
    mfaEnabled: new FormControl(false),
    mfaMethod: new FormControl({ value: '', disabled: true }),
    totpSecret: new FormControl({ value: '', disabled: true }),
    smsPhoneNumber: new FormControl({ value: '', disabled: true }),
    emailAddress: new FormControl({ value: '', disabled: true }),
    duoIntegration: new FormControl({ value: '', disabled: true }),
    fingerprintEnabled: new FormControl({ value: false, disabled: true }),
    faceEnabled: new FormControl({ value: false, disabled: true }),
    securityKeyEnabled: new FormControl({ value: false, disabled: true })
  });

  constructor(private fb: FormBuilder) {}

  toggleMFA(enabled: boolean): void {
    if (enabled) {
      this.mfaForm.get('mfaMethod')?.enable();
    } else {
      this.mfaForm.get('mfaMethod')?.disable();
      this.disableAllMfaFields();
    }
  }

  selectMFAMethod(event: any): void {
    const method = event.value;
    this.disableAllMfaFields();
    
    if (method === 'totp') {
      this.mfaForm.get('totpSecret')?.enable();
    } else if (method === 'sms') {
      this.mfaForm.get('smsPhoneNumber')?.enable();
    } else if (method === 'email') {
      this.mfaForm.get('emailAddress')?.enable();
    } else if (method === 'duo') {
      this.mfaForm.get('duoIntegration')?.enable();
    } else if (method === 'fingerprint') {
      this.mfaForm.get('fingerprintEnabled')?.enable();
    } else if (method === 'face') {
      this.mfaForm.get('faceEnabled')?.enable();
    } else if (method === 'securityKey') {
      this.mfaForm.get('securityKeyEnabled')?.enable();
    }
  }

  disableAllMfaFields(): void {
    this.mfaForm.get('totpSecret')?.disable();
    this.mfaForm.get('smsPhoneNumber')?.disable();
    this.mfaForm.get('emailAddress')?.disable();
    this.mfaForm.get('duoIntegration')?.disable();
    this.mfaForm.get('fingerprintEnabled')?.disable();
    this.mfaForm.get('faceEnabled')?.disable();
    this.mfaForm.get('securityKeyEnabled')?.disable();
  }

  onSubmit() {
    if (this.mfaForm.valid) {
      // Save the form data
      console.log('Form Data:', this.mfaForm.value);
      // Here you would typically call a service to save the settings
    }
  }
}
