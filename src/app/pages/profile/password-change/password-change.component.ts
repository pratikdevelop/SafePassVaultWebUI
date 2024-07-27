import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule],
  templateUrl: './password-change.component.html',
})
export class PasswordChangeComponent implements OnInit {
  passwordChangeForm: FormGroup = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required])
  });

  constructor() { }

  ngOnInit(): void {
  }

  // mustMatch(controlName: string): ValidatorFn  {
  //   return (formGroup: FormGroup) => {
  //     const newPassword = formGroup.get(controlName);
  //     const confirmNewPassword = formGroup.get('confirmNewPassword');

  //     if (newPassword.value !== confirmNewPassword.value) {
  //       confirmNewPassword.setErrors({ mustMatch: true });
  //     } else {
  //       confirmNewPassword.setErrors(null);
  //     }
  //   };
  // }

  onSubmit(): void {
    if (this.passwordChangeForm.valid) {
      // Call API to change password
      console.log('Password changed successfully!');
    } else {
      console.log('Please fill in all required fields');
    }
  }
}
