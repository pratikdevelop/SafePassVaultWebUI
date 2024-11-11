import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../services/common.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mfa-setting',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './mfa-setting.component.html',
  styleUrls: ['./mfa-setting.component.css'],
})
export class MfaSettingComponent {
  mfaForm: FormGroup;
  userProfile: any;
  readonly snackBar = inject(MatSnackBar);
  readonly commonService = inject(CommonService);
  readonly authService = inject(AuthService);
  qrCodeUrl: string = '';

  constructor(private fb: FormBuilder) {
    this.mfaForm = this.fb.group({
      mfaEnabled: [false],
      mfaMethod: [{ value: '', disabled: true }],
      totpSecret: [{ value: '', disabled: true }],
      smsPhoneNumber: [{ value: '', disabled: true }],
      emailAddress: [{ value: '', disabled: true }],
    });
    this.authService.getProfile().subscribe((response: any) => {
      this.userProfile = response.user;      
      this.populateFormWithUserProfile(this.userProfile);
    });


  }

  populateFormWithUserProfile(profile: any): void {
    this.mfaForm.patchValue({
      mfaEnabled: profile.mfaEnabled || false,
      mfaMethod: profile.mfaMethod || '',
      totpSecret: profile.mfaMethod === 'totp' ? profile.totpSecret || '' : '',
      smsPhoneNumber: profile.mfaMethod === 'sms' ? profile.phone || '' : '',
      emailAddress: profile.mfaMethod === 'email' ? profile.email || '' : '',
    });

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
    this.qrCodeUrl = '';
    this.disableAllMfaFields();

    if (method === 'totp') {
      !this.userProfile.totpSecret ? this.setup2FA() : null;
      this.mfaForm.get('totpSecret')?.disable()
      this.qrCodeUrl = this.userProfile.totpQrImage ?? null;
    } else if (method === 'sms') {
      this.mfaForm.get('smsPhoneNumber')?.enable();
      this.mfaForm.get('smsPhoneNumber')?.setValue(this.userProfile.phone);
    } else if (method === 'email') {
      this.mfaForm.get('emailAddress')?.enable();
      console.log('email', this.userProfile.email);
      this.mfaForm.get('emailAddress')?.setValue(this.userProfile.email);
    }
  }

  disableAllMfaFields(): void {
    this.mfaForm.get('totpSecret')?.disable();
    this.mfaForm.get('smsPhoneNumber')?.disable();
    this.mfaForm.get('emailAddress')?.disable();
  }

  onSubmit() {
    if (this.mfaForm.valid) {
      this.authService.updateMfaSettings(this.mfaForm.value).subscribe({
        next: (response: any) => {
          this.snackBar.open('MFA settings updated successfully:', 'Ok', {
            duration: 3000,
          });
        },
        error: (error: { error: { message: any; }; }) => {
          this.snackBar.open(
            `Failed to update MFA settings.${error.error.message} `,
            'Ok',
            {
              duration: 3000,
            }
          );
          console.error('Error updating MFA settings:', error.error.message);
        },
      });
    }
  }

  setup2FA(): void {

    this.authService.setup2FA(this.userProfile.email).subscribe(
      (response: { imageUrl: string; }) => {
        this.qrCodeUrl = response.imageUrl; // Display QR code URL to user
        this.mfaForm.controls['totpSecret'].enable();
      },
      (error: any) => {
        console.error('Error setting up 2FA', error);
      }
    );
  }
  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
}
