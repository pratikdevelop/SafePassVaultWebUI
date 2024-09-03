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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, MatStepperModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  route = inject(ActivatedRoute);
  auth = inject(AuthService)
  hide = signal(true);
  loading = false;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, this.passwordValidator])
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

  
  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) {
      return null;
    }

    // Define your password validation logic here
    // For example, check if password length is at least 8 characters
    const isValid = password.length >= 8;
    return isValid ? null : { invalidPassword: true };
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.auth.login(this.loginForm.value).subscribe((response) => {
        if (response.mfaRequired) {
          this.mfaMethod = response.mfaMethod; 
          this.router.navigateByUrl(`/auth/mfa-verification?mfaMethod=${response.mfaMethod}&email=${this.loginForm.value.username}`)

        } else {
          this.auth.getProfile().subscribe((response)=>{
            localStorage.setItem('token', response.token);
            this.snackbar.open('Login successful', 'close'); // Assuming snackbar implementation
            this.router.navigate(['/dashboard/passwords']);
          })
        }
        this.loading = false;
       
      }, error => {
        this.loading = false;
        console.error('Error logging in:', error);
        this.snackbar.open('Login failed: ' + error.error.message, 'close');

      })
    }
  }
}
