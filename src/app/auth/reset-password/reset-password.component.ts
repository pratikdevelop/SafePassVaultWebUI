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

  
  tokenForm = new FormGroup({
    token: new FormControl(''),
  });
  snackbar = inject(MatSnackBar);
  service = inject(AuthService);
  route = inject(ActivatedRoute);
  changeDetectorRef = inject(ChangeDetectorRef);
  ngOnInit(): void {}
  
  sendResetToken(): void {
    if (this.emailForm.invalid) return;
    this.service.resetPassword(this.emailForm.value.email).subscribe(
      (response: any) => {
        this.snackbar.open('Password reset Link is send to your email.', '', {
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
  


}
