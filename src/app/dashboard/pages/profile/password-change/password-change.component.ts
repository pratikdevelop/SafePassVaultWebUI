import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../services/auth.service';

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
  authService = inject(AuthService)

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
      const { currentPassword, newPassword } = this.passwordChangeForm.value;

      this.authService.passwordReset(currentPassword, newPassword).subscribe(
        () => {
          console.log('Password changed successfully!');
        },
        (error: any) => console.error('Error changing password', error)
      );
    } else {
      console.log('Please fill in all required fields');
    }
  }
}
