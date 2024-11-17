import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,  MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css'
})
export class RecoveryComponent {

  recoveryForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  readonly recoveryService = inject(AuthService);
  readonly SnackBar = inject(MatSnackBar);
  readonly router = inject(Router);
  isLoading!: boolean;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize the form with validators
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      recoveryToken: ['', Validators.required],
      encryptedRecoveryPhrase: ['', Validators.required],
      privateKeyPEM: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      const formData = this.recoveryForm.value;

      this.recoveryService.verifyRecovery(formData).subscribe({
        next: (response: any) => {
          this.successMessage = response.message;
          this.errorMessage = null;
          this.isLoading = false;
          this.SnackBar.open(response.message, 'Close', {
            duration: 5000,
            });
          this.router.navigate(['/auth/reset-password']);
        
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred during account recovery.';
          this.successMessage = null;
          this.isLoading = false;
        },
      });
    }
  }
}
