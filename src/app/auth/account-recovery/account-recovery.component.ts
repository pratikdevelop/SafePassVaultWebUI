import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-recovery',
  standalone: true,
  imports: [ FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './account-recovery.component.html',
  styleUrl: './account-recovery.component.css'
})
export class AccountRecoveryComponent {
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  readonly snackbar = inject(MatSnackBar);
  readonly service = inject(AuthService);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly router =  inject(Router)
  ngOnInit(): void {}
  
  sendResetToken(): void {
    if (this.emailForm.invalid) return;
    this.service.resetPassword(this.emailForm.value.email).subscribe(
      (response: any) => {
        this.snackbar.open('Password reset Link is send to your email.', '', {
          duration: 300,
          direction: 'rtl',
        });
        this.router.navigate(['/auth/recovery-verify'])
  
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
