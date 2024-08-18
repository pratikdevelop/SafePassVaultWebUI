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
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

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
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {

  isTokenSent: any;
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  isResettingPassowrd: boolean = false;
  linkVerified = false;
  loading = true;

  passwordForm = new FormGroup({
    _id: new FormControl(null),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8), // Minimum length of 8 characters
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      ), // Strong password pattern
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      this.confirmPasswordMatchValidator, // Custom validator to check password match
    ]),
  });
  tokenForm = new FormGroup({
    token: new FormControl(''),
  });
  snackbar = inject(MatSnackBar);
  service = inject(AuthService);
  route = inject(ActivatedRoute);
  changeDetectorRef = inject(ChangeDetectorRef);
  ngOnInit(): void {}
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

  sendResetToken(): void {
    if (this.emailForm.invalid) return;
    this.service.resetPassword(this.emailForm.value.email).subscribe(
      (response: any) => {
        console.log('pp', response);this.isTokenSent =true;
        

        this.passwordForm.controls._id.setValue(response.userId);
        this.snackbar.open('Password reset code is send to your email.', '', {
          duration: 300,
          direction: 'rtl',
        });
      },
      (error) => {
        this.snackbar.open('Your Email was not found', '', {
          duration: 300,
          direction: 'rtl',
        });
      }
    );
  }
  resetPassword(): void {
    if (this.passwordForm.invalid) return;
    const id = this.passwordForm.value?._id;
    this.service.changePassword(this.passwordForm.value, id).subscribe(
      (res: any) => {
        this.snackbar.open('password reset', '', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackbar.open(error.message, '', {
          duration: 3000,
        });
      }
    );
  }

  validateToken(): void {
    this.service
      .verifYResetRequest(
        this.passwordForm.value._id ?? '',
        this.tokenForm.value.token ?? ''
      )
      .subscribe(
        (res: any) => {
          if (res.verified) {
            this.linkVerified = true;
          }
          this.loading = false;

          this.changeDetectorRef.detectChanges();
        },
        (error) => {
          console.error('error', error);
          this.isResettingPassowrd = false;
        }
      );
  }
}
