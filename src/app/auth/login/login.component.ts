import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, MatStepperModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  route = inject(ActivatedRoute);
  auth = inject(AuthService)
  hide = signal(true);
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  mfaForm = new FormGroup({
    totpCode: new FormControl(''),
    smsCode: new FormControl(''),
    emailCode: new FormControl('')
  });
  mfaMethod: any;
  showMfaStep: boolean= false;;

  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      this.loginForm.patchValue(res);
    })
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe((response) => {
        if (response.mfaRequired) {
          this.showMfaStep = true;
          this.mfaMethod = response.mfaMethod; // Retrieve MFA method from response
          // Manually move to the MFA step
          const stepper = document.querySelector('mat-vertical-stepper') as any;
          stepper.selectedIndex = 1; // Move to the MFA step
        } else {
          localStorage.setItem('token', response.token);
          this.snackbar.open('Login successful', 'close'); // Assuming snackbar implementation
          this.router.navigate(['/dashboard']);
        }
       
      }, error => {
        console.error('Error logging in:', error);
        this.snackbar.open('Login failed: ' + error.message, 'close');

      })
    }
  }


  onMfaSubmit() {
    if (this.mfaForm.valid) {
      const mfaData = {
        method: this.mfaMethod,
        ...this.mfaForm.value
      };

      this.auth.verifyMFA(mfaData).subscribe(response => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          console.error('MFA verification failed');
        }
      }, error => {
        console.error('MFA verification error', error);
      });
    }
  }

}
