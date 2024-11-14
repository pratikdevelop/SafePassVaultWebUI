import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recovery-phrase',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './recovery-phrase.component.html',
  styleUrls: ['./recovery-phrase.component.css']
})
export class RecoveryPhraseComponent {

  isPhraseVisible: boolean = false;
  isLoading: boolean = false;
  recoveryPhrase!: string;
  publicKey!: string;
  privateKey!: string;
  publicKeyFingerprint!: string;
  privateKeyFingerprint!: string;
  publicKeyCreatedDate!: string;
  privateKeyCreatedDate!: string;
  publicKeyExpiresDate!: string;
  privateKeyExpiresDate!: string;
  publicKeyLength!: number;
  privateKeyLength!: number;
  publicKeyAlgorithm: string = 'RSA';  // Example algorithm used for key generation
  privateKeyAlgorithm: string = 'RSA'; // Example algorithm used for key generation
  readonly userService = inject(AuthService);
  readonly changeDetectorRef = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    // Subscribe to the user profile and fetch the recovery phrase and keys
    this.userService._userProfileSubject.pipe().subscribe({
      next: (profile) => {
        console.log('User Profile:', profile);

        if (profile?.user?.recoveryPhrase) {
          // Set recovery phrase
          this.recoveryPhrase = profile.user.recoveryPhrase;

          // Set public and private keys
          this.publicKey = profile.user.publicKey;
          this.privateKey = profile.user.recoveryPhrase;

          // Set fingerprint (example, in real case you'd calculate it or get from backend)
          this.publicKeyFingerprint = this.calculateFingerprint(this.publicKey);
          this.privateKeyFingerprint = this.calculateFingerprint(this.privateKey);

          // Set key creation and expiration dates (example values)
          this.publicKeyCreatedDate = '2022-01-01';
          this.privateKeyCreatedDate = '2022-01-01';
          this.publicKeyExpiresDate = '2023-01-01';
          this.privateKeyExpiresDate = '2023-01-01';

          // Set key lengths (e.g., 2048 bits)
          this.publicKeyLength = 2048;
          this.privateKeyLength = 2048;

          // Set algorithms (RSA in this case)
          this.publicKeyAlgorithm = 'RSA';
          this.privateKeyAlgorithm = 'RSA';
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      },
      complete: () => {
        console.log('User profile subscription completed');
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  // Utility function to calculate fingerprint (this is just a mock for demonstration)
  calculateFingerprint(key: string): string {
    // Normally, you'd use a library or backend to calculate the actual fingerprint of the key
    return key.substring(0, 45).toString()  // Mock fingerprint
  }

  // Download the key (public or private)
  downloadKey(keyType: 'public' | 'private') {
    const key = keyType === 'public' ? this.publicKey : this.privateKey;
    const fileName = `${keyType}-key.txt`;

    // Create a blob from the key
    const blob = new Blob([key], { type: 'text/plain' });

    // Create an invisible anchor element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
