import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mfa-setting',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, CommonModule, MatSelectModule, 
    MatOptionModule, ReactiveFormsModule, FormsModule, MatButtonModule, 
    MatSliderModule, MatSlideToggleModule, MatIconModule
  ],
  templateUrl: './mfa-setting.component.html',
  styleUrls: ['./mfa-setting.component.css']
})
export class MfaSettingComponent {
  mfaForm: FormGroup;
  @Output() toggleSideNav = new EventEmitter<any>()
  authService = inject(AuthService);
  userProfile: any;

  constructor(private fb: FormBuilder) {
    this.mfaForm = this.fb.group({
      mfaEnabled: [false],
      mfaMethod: [{ value: '', disabled: true }],
      totpSecret: [{ value: '', disabled: true }],
      smsPhoneNumber: [{ value: '', disabled: true }],
      emailAddress: [{ value: '', disabled: true }],
      // duoIntegration: [{ value: '', disabled: true }],
      // fingerprintEnabled: [{ value: false, disabled: true }],
      // faceEnabled: [{ value: false, disabled: true }],
      // securityKeyEnabled: [{ value: false, disabled: true }]
    });

    // Subscribe to user profile updates
    this.authService.userProfile$.subscribe((res) => {
      this.userProfile = res
      this.populateFormWithUserProfile(res)
      // Populate the form with user profile data if needed
    });
  }

  populateFormWithUserProfile(profile: any): void {
    // Map user profile data to form controls
    this.mfaForm.patchValue({
      mfaEnabled: profile.mfaEnabled || false,
      mfaMethod: profile.mfaMethod || '',
      totpSecret: profile.mfaMethod === 'totp' ? profile.totpSecret || '' : '',
      smsPhoneNumber: profile.mfaMethod === 'sms' ? profile.smsPhoneNumber || '' : '',
      emailAddress: profile.mfaMethod === 'email' ? profile.emailAddress || '' : '',
      // duoIntegration: profile.duoIntegration || '',
      // fingerprintEnabled: profile.fingerprintEnabled || false,
      // faceEnabled: profile.faceEnabled || false,
      // securityKeyEnabled: profile.securityKeyEnabled || false
    });

    // Enable/Disable form fields based on MFA settings
    this.toggleMFA(profile.mfaEnabled);
    this.selectMFAMethod({ value: profile.mfaMethod });
  }




  toggleMFA(enabled: boolean): void {
    const mfaMethodControl = this.mfaForm.get('mfaMethod');
    if (enabled) {
      mfaMethodControl?.enable();
    } else {
      mfaMethodControl?.disable();
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
      this.mfaForm.get('smsPhoneNumber')?.setValue(this.userProfile.phone)

    } else if (method === 'email') {
      this.mfaForm.get('emailAddress')?.enable();
      console.log('email', this.userProfile.email);
      
      this.mfaForm.get('emailAddress')?.setValue(this.userProfile.email)


    }
    // else if (method === 'duo') {
    //   this.mfaForm.get('duoIntegration')?.enable();
    // } else if (method === 'fingerprint') {
    //   this.mfaForm.get('fingerprintEnabled')?.enable();
    // } else if (method === 'face') {
    //   this.mfaForm.get('faceEnabled')?.enable();
    // } else if (method === 'securityKey') {
    //   this.mfaForm.get('securityKeyEnabled')?.enable();
    // }
  }

  disableAllMfaFields(): void {
    this.mfaForm.get('totpSecret')?.disable();
    this.mfaForm.get('smsPhoneNumber')?.disable();
    this.mfaForm.get('emailAddress')?.disable();
    // this.mfaForm.get('duoIntegration')?.disable();
    // this.mfaForm.get('fingerprintEnabled')?.disable();
    // this.mfaForm.get('faceEnabled')?.disable();
    // this.mfaForm.get('securityKeyEnabled')?.disable();
  }

  onSubmit() {
    console.log('valid', this.mfaForm);
    
    if (this.mfaForm.valid) {
      // Send the form data to the server
      console.log('Form Data:', this.mfaForm.value);

      // Example: Call a method in your AuthService to save the MFA settings
      this.authService.updateMfaSettings(this.mfaForm.value).subscribe({
        next: (response) => {
          console.log('MFA settings updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating MFA settings:', error);
        }
      });
    }
  }

  toggleSideBar(): void {
    this.toggleSideNav.emit()
  }
}
