import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-magic-link-verification',
  templateUrl: './magic-link-verification.component.html',
  standalone:true,
  imports:[MatIconModule,MatProgressSpinnerModule, CommonModule],
  styleUrls: ['./magic-link-verification.component.css']
})
export class MagicLinkVerificationComponent implements OnInit {
  loading = true;
  verificationStatus: 'success' | 'failed' | null = null;
  userEmail: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Extract token and email from the URL
    const token = this.route.snapshot.queryParamMap.get('token');
    this.userEmail = this.route.snapshot.queryParamMap.get('email');

    if (token) {
      this.verifyMagicLink(token);
    } else {
      this.verificationStatus = 'failed';
      this.loading = false;
    }
  }

  verifyMagicLink(token: string): void {
    this.authService.verifyMagicLink(token).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.verificationStatus = 'success';
        this.loading = false;
        this.snackbar.open('Login successful!', 'Close', { duration: 2000 });
        this.router.navigate(['/dashboard/passwords']);
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.verificationStatus = 'failed';
        this.loading = false;
        this.snackbar.open('Invalid or expired magic link', 'Close', { duration: 3000 });
        this.changeDetectorRef.detectChanges();

      }
    );
  }

  resendMagicLink(): void {
    if (this.userEmail) {
      this.authService.resendMagicLink(this.userEmail).subscribe(
        () => {
          this.snackbar.open('A new magic link has been sent to your email.', 'Close', { duration: 3000 });
        },
        (error) => {
          this.snackbar.open('Failed to resend magic link. Please try again later.', 'Close', { duration: 3000 });
        }
      );
    }
  }
}
