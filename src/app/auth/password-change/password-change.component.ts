import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css'],
})
export class PasswordChangeComponent implements OnInit {
  service = inject(AuthService);
  readonly snackBar = inject(MatSnackBar);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);

  passwordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordValidator
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      this.confirmPasswordMatchValidator
    ]),
  });

  private userId: string = '';
  private resetToken: string = '';
  linkVerified: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        const decodedToken = atob(token); // Decode the base64 encoded token
        const [userId, resetToken] = decodedToken.split(':');
        this.userId = userId;
        this.resetToken = resetToken;
        this.validateToken();
      } else {
        this.snackBar.open('Invalid or missing token', '', { duration: 3000 });
        this.router.navigate(['/login']); // Redirect to login if the token is missing or invalid
      }
    });
  }

  passwordValidator(control: FormControl): { [s: string]: boolean } | null {
    const passwordValidation =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,}$/;
    const password = control.value;
    if (password && !passwordValidation.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }

  confirmPasswordMatchValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    if (control.parent && control.parent.get('password')) {
      // Compare password and confirmPassword values
      if (control.value !== control.parent?.get('password')?.value) {
        return { confirmPasswordMismatch: true };
      }
    }
    return null;
  }

  resetPassword(): void {
    if (this.passwordForm.invalid) return;
    const payload = {
      password: this.passwordForm.get('password')?.value,
      confirmPassword: this.passwordForm.get('confirmPassword')?.value,
    
    }

    this.service.changePassword(payload, this.userId).subscribe(

      (res: any) => {
        this.snackBar.open('Password reset successfully', '', {
          duration: 3000,
        });
        this.router.navigate(['/login']); // Redirect to login after successful reset
      },
      (error) => {
        this.snackBar.open(error.message, '', {
          duration: 3000,
        });
      }
    );
  }

  validateToken(): void {
    this.service.verifYResetRequest(this.userId, this.resetToken).subscribe(
      (res: any) => {
        if (res.verified) {
          this.linkVerified = true;
        } else {
          this.snackBar.open('Password reset link has expired or is invalid', '', { duration: 3000 });
          this.router.navigate(['/login']);
        }
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.error('error', error);
        this.snackBar.open('Error verifying reset token', '', { duration: 3000 });
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
