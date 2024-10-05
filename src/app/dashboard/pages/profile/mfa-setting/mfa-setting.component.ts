import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../../../services/common.service';
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
    MatSnackBarModule
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

  constructor(private fb: FormBuilder) {
    this.mfaForm = this.fb.group({
      mfaEnabled: [false],
      mfaMethod: [{ value: '', disabled: true }],
      totpSecret: [{ value: '', disabled: true }],
      smsPhoneNumber: [{ value: '', disabled: true }],
      emailAddress: [{ value: '', disabled: true }],
    });

    this.authService.userProfile$.subscribe((userProfile) => {
      this.userProfile = userProfile;
      this.populateFormWithUserProfile(userProfile);
    });
  }

  populateFormWithUserProfile(profile: any): void {
    this.mfaForm.patchValue({
      mfaEnabled: profile.mfaEnabled || false,
      mfaMethod: profile.mfaMethod || '',
      totpSecret: profile.mfaMethod === 'totp' ? profile.totpSecret || '' : '',
      smsPhoneNumber:
        profile.mfaMethod === 'sms' ? profile.smsPhoneNumber || '' : '',
      emailAddress:
        profile.mfaMethod === 'email' ? profile.emailAddress || '' : '',
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
    this.disableAllMfaFields();

    if (method === 'totp') {
      this.mfaForm.get('totpSecret')?.enable();
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
        next: (response) => {
          this.snackBar.open('MFA settings updated successfully:', 'Ok', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open(
            'Failed to update MFA settings. Please try again later.',
            'Ok',
            {
              duration: 3000,
              }
              
          )
          console.error('Error updating MFA settings:', error);
        },
      });
    }
  }

  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
}
