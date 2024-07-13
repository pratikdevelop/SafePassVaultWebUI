import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  emailForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email])
  })
  isResettingPassowrd: boolean = false;
  linkVerified = false;
  loading = true;

  passwordForm = new FormGroup({
    _id: new FormControl(null),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),  // Minimum length of 8 characters
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)  // Strong password pattern
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      this.confirmPasswordMatchValidator  // Custom validator to check password match
    ])
  });
  snackbar = inject(MatSnackBar);
  service = inject(AuthService)
  route = inject(ActivatedRoute);
  changeDetectorRef = inject(ChangeDetectorRef)
  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      if (param && param.id) {
        this.isResettingPassowrd = true;
        this.service.verifYResetRequest(param.id, param.token).subscribe((res: any) => {
          if (res.verified) {
            this.linkVerified = true;
            this.passwordForm.get("_id")?.setValue(param.id);
          }
          this.loading = false;
          this.changeDetectorRef.detectChanges()
        }, error => {
          console.error("error", error);
          this.isResettingPassowrd = false;
        })
      }else {
        this.loading = false;
        this.changeDetectorRef.detectChanges()
      }
    })
  }
  confirmPasswordMatchValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.parent && control.parent.get('password')) {
      // Compare password and confirmPassword values
      if (control.value !== control.parent?.get('password')?.value) {
        return { 'confirmPasswordMismatch': true };
      }
    }
    return null;
  }


  onSubmit(): void {
    if (this.emailForm.invalid) return;
    this.service.resetPassword(this.emailForm.value.email).subscribe((response: any) => {
      this.snackbar.open("Password reset Link is send to your email.", "", {
        duration: 300,
        direction: 'rtl'
      })
    }, error => {
      this.snackbar.open("Your Email was not found", "", {
        duration: 300,
        direction: 'rtl'
      });
    })
  }
  resetPassword(): void {
    if (this.passwordForm.invalid) return;
    const id = this.passwordForm.value?._id
    this.service.changePassword(this.passwordForm.value,id ).subscribe((res:any)=>{
      this.snackbar.open("password reset", "", {
        duration:3000
      })
    }, error=>{
      this.snackbar.open(error.message, "", {
        duration: 3000
      })
    })
  }
}
