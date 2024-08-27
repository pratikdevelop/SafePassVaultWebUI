import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mfa-verification',
  standalone: true,
  imports: [
    MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule,
    MatButtonModule, CommonModule, MatSnackBarModule

  ],
  templateUrl: './mfa-verification.component.html',
  styleUrl: './mfa-verification.component.css'
})
export class MfaVerificationComponent {
  auth = inject(AuthService)
  activateRoute = inject(ActivatedRoute)
  router= inject(Router);
  snackbar = inject(MatSnackBar)
  mfaMethod: string = 'email';
  hide = signal(true);
  mfaForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    totpCode: new FormControl(''),
    smsCode: new FormControl(''),
    emailCode: new FormControl('')
  });
  constructor() { 
    this.activateRoute.queryParams.subscribe(params => {
      this.mfaMethod = params['mfaMethod'];
      this.mfaForm.controls.email.setValue(params[`email`])
      });
  }

  onMfaSubmit() {
    if (this.mfaForm.valid) {
      const mfaData = {
        method: this.mfaMethod,
        ...this.mfaForm.value
      };

      this.auth.verifyMFA(mfaData).subscribe(response => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          this.snackbar.open('MFA verification successful', 'Dismiss', {
            duration: 2000,
            });

          this.router.navigate(['/dashboard/passwords']);
        } else {
          this.snackbar.open('MFA verification failed', 'Dismiss', {
            duration: 2000,
            });
          console.error('MFA verification failed');
        }
      }, error => {
        console.error('MFA verification error', error);
      });
    }
  }
}



