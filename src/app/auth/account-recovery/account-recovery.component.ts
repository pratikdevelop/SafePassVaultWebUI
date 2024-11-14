import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-recovery',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, CommonModule],
  templateUrl: './account-recovery.component.html',
  styleUrl: './account-recovery.component.css'
})
export class AccountRecoveryComponent {
  recoveryPhrase: string = ''; // Store the recovery phrase input
  privateKey: string = ''; // Store the private key input
  recoveryStatus: string = ''; // Recovery process feedback
  recoverySuccess: boolean = false; // Track if recovery is successful
  readonly authService = inject(AuthService);

  constructor() { }

  // Function to handle account recovery
  recoverAccount(): void {
    this.recoveryStatus = ''; // Reset status message
    this.recoverySuccess = false;
    if (!this.recoveryPhrase) {
      this.recoveryStatus = 'Please enter your recovery phrase.';
      return;
    }

    this.authService.recoverAccount(this.recoveryPhrase).pipe().subscribe({
      next: (response) => {
        this.privateKey = response.privateKey;
        this.recoveryStatus = 'Account recovered successfully!';
        this.recoverySuccess = true;
      },
      error: (error) => {
        this.recoveryStatus = 'Error recovering account: ' + error.message;
      }
    })

  }
}
