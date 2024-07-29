import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-mfa-setting',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatSliderModule],
  templateUrl: './mfa-setting.component.html',
  styleUrl: './mfa-setting.component.css'
})
export class MfaSettingComponent {
  mfaForm = new FormGroup({
    mfaEnabled: new FormControl(false),
    mfaMethod: new FormControl({ value: '', disabled: true }),
    totpSecret: new FormControl({ value: '', disabled: true }),
    smsPhoneNumber: new FormControl({ value: '', disabled: true }),
    emailAddress: new FormControl({ value: '', disabled: true })
  });

  constructor(private fb: FormBuilder) {


    this.mfaForm.get('mfaEnabled')?.valueChanges.subscribe(enabled => {
      if (enabled) {
        this.mfaForm.get('mfaMethod')?.enable();
      } else {
        this.mfaForm.get('mfaMethod')?.disable();
        this.mfaForm.get('totpSecret')?.disable();
        this.mfaForm.get('smsPhoneNumber')?.disable();
        this.mfaForm.get('emailAddress')?.disable();
      }
    });

    this.mfaForm.get('mfaMethod')?.valueChanges.subscribe(method => {
      this.mfaForm.get('totpSecret')?.disable();
      this.mfaForm.get('smsPhoneNumber')?.disable();
      this.mfaForm.get('emailAddress')?.disable();
      if (method === 'totp') {
        this.mfaForm.get('totpSecret')?.enable();
      } else if (method === 'sms') {
        this.mfaForm.get('smsPhoneNumber')?.enable();
      } else if (method === 'email') {
        this.mfaForm.get('emailAddress')?.enable();
      }
    });
  }

  onSubmit() {
    if (this.mfaForm.valid) {
      // Save the form data
      console.log('Form Data:', this.mfaForm.value);
      // Here you would typically call a service to save the settings
    }
  }

}
