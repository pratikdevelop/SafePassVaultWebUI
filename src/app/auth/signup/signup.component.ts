import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import zxcvbn from 'zxcvbn';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatSnackBarModule, RouterModule, MatButtonModule, MatStepperModule, MatFormFieldModule, CommonModule, MatSelectModule, MatOptionModule, MatInputModule, MatIconModule, MatProgressBarModule],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  isPaidPlan: boolean = false;
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  route = inject(ActivatedRoute);
  authService = inject(AuthService)
  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]{10}")]),
    password: new FormControl('', [Validators.required, this.passwordValidator]),
  });
  billingForm = new FormGroup({
    billingAddress: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required)
  });

  value = 0
  paymentForm = new FormGroup({
    paymentMethod: new FormControl('', Validators.required),
    cardNumber: new FormControl('', Validators.required),
    expiryDate: new FormControl('', Validators.required),
    cvv: new FormControl('', Validators.required)
  });
  hide = signal(true);
  strength: number = 0;
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  ngOnInit(): void {
    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      const result = zxcvbn(password);
      this.strength = result.score;
      this.value = (this.strength / 4) * 100;
    })
  }
  onSubmit() {
    const userDetails = {
      ...this.signupForm.value,
      ...this.billingForm.value,
      ...this.paymentForm.value
    };
    this.authService.signup(userDetails)
      .subscribe(
        response => {
          // Handle successful signup (e.g., redirect to login page, show success message)
          localStorage.setItem("email", this.signupForm.value.email)
          this.router.navigateByUrl("/auth/email-confirmation")
          console.log('Signup successful:', response);

          this.signupForm.reset(); // Reset form after successful signup
          this.snackbar.open("Signup successful", "close", {
            duration: 3000
          })
        },
        error => {
          console.error('Error during signup:', error);
          this.snackbar.open("An error occurred during signup. Please try again.", "close", {
            duration: 3000
          })
        }
      );
  }

  generatePassword(): void {
    const passwords = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    this.signupForm.get("password")?.setValue(passwords)
    const result = zxcvbn(passwords);
    this.strength = result.score;
    this.value = (this.strength / 4) * 100;
  }
  passwordValidator(control: FormControl): { [s: string]: boolean } | null {
    const passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{6,}$/;
    const password = control.value;
    if (password && !passwordValidation.test(password)) {
      return { invalidPassword: true };
    }
    return null;
  }

  getPasswordStrengthLabel(strength: number): string {
    switch (strength) {
      case 0 && this.signupForm.value.password !== null:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  }


}
