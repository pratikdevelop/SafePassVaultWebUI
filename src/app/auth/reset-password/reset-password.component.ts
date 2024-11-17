import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {

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
        this.router.navigate(['/auth/login']); // Redirect to login after successful reset
      },
      (error) => {
        this.snackBar.open(error.message, '', {
          duration: 3000,
        });
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
