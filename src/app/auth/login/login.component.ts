import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  readonly snackbar = inject(MatSnackBar);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly auth = inject(AuthService);
  hide = signal(true);
  loading = false;

  // Track the selected login mode
  loginMode: string = 'password';

  // Define the login form
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      this.passwordValidator,
    ]),
  });


  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      this.loginForm.patchValue(res);
    });
  }

  // Validate password length
  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    return password && password.length >= 8 ? null : { invalidPassword: true };
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateLoginPage(event: any): void {
    console.log('fff', event);

    this.loginMode = event.value;
    this.changeDetectorRef.detectChanges()
  }
  // Handle form submission based on the login mode
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      if (this.loginMode === 'password') {
        this.handlePasswordLogin();
      } else {
        this.handlePasswordlessLogin();
      }
    }
  }

  // Password-based login handler
  private handlePasswordLogin() {
    this.auth.login(this.loginForm.value).subscribe(
      (response) => {
        this.processLoginResponse(response);
      },
      (error) => {
        this.handleLoginError(error);
      }
    );
  }

  // Passwordless login handler
  private handlePasswordlessLogin() {
    const { username } = this.loginForm.value;
    this.auth.requestLogin(username).subscribe(
      () => {
        this.snackbar.open(
          'Login link sent to your email. Please check your inbox.',
          'close',
          { duration: 3000 }
        );
        this.loading = false;
      },
      (error) => {
        this.handleLoginError(error);
      }
    );
  }

  // Handle successful login response
  private processLoginResponse(response: any) {
    if (response.mfaRequired) {
      this.router.navigateByUrl(
        `/auth/mfa-verification?mfaMethod=${response.mfaMethod}&email=${this.loginForm.value.username}`
      );
    } else {
      localStorage.setItem('token', response.token);
      this.auth.getProfile().subscribe(() => {
        this.snackbar.open('Login successful', 'close', {
          duration: 2000,
        });
        this.router.navigate(['/dashboard/passwords']);
      });
    }
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  // Handle login error
  private handleLoginError(error: any) {
    this.loading = false;
    this.snackbar.open(
      'Login failed: ' + (error.error.message || 'Unknown error'),
      'close'
    );
    this.changeDetectorRef.detectChanges();
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateValidation() {
    if (this.loginMode === 'passwordless') {
      // Remove password validation when login mode is 'magicLink'
      this.loginForm.controls['password'].clearValidators();
    } else {
      // Add password validation back for regular password login
      this.loginForm.controls['password'].setValidators([
        Validators.required,
        this.passwordValidator,
      ]);
    }
    // Mark password control as dirty so that validation is immediately applied
    this.loginForm.controls['password'].updateValueAndValidity();
  }

  // Toggle between password and magic link login modes
  toggleLoginMode(mode: string) {
    this.loginMode = mode;
    this.updateValidation(); // Update validation whenever login mode changes
  }
}
