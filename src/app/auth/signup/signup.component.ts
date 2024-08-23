import {
  ChangeDetectionStrategy,
  Component,
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import zxcvbn from 'zxcvbn';
import {
  ProgressBarMode,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { SecurityQuestionService } from '../../services/security-question.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    RouterModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
  ],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  isPaidPlan: boolean = false;
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  securityQuestionService = inject(SecurityQuestionService);

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{10}'),
    ]),
    password: new FormControl('', [
      Validators.required,
      this.passwordValidator,
    ]),
  });

  billingForm = new FormGroup({
    billingAddress: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  });

  value = 0;
  paymentForm = new FormGroup({
    planType: new FormControl(''),
    paymentMethod: new FormControl('', Validators.required),
    cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{13,19}$')]),
    expiryDate: new FormControl('', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/(\\d{2})$')]),
    cvv: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]),
    numberOfUsers: new FormControl(1)
  });

  // Initialize OTP Form
  OTPForm = new FormGroup({
    confirmationCode: new FormControl('', Validators.required),
  });

  // Initialize Security Questions Form
  securityForm = new FormGroup({
    securityQuestion1: new FormControl(''),
    securityAnswer1: new FormControl(''),
    securityQuestion2: new FormControl(''),
    securityAnswer2: new FormControl(''),
  });

  hide = signal(true);
  strength: number = 0;
  expiryDateInvalid!: boolean;

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      const result = zxcvbn(password);
      this.strength = result.score;
      this.value = (this.strength / 4) * 100;
    });

    this.route.queryParams.subscribe((params: any) => {
      this.isPaidPlan = (params['plan'] && params.plan !== 'free');
      this.paymentForm.get('planType')?.setValue(params.plan);

      // Handle the action parameter
      if (params.action === 'trial') {
        this.handleTrialSignup();
      } else if (params.action === 'purchase') {
        this.handlePurchaseSignup();
      }
    });
  }

  handleTrialSignup(): void {
    // Logic for handling trial signups
    console.log('User is signing up for a trial.');
    // You may skip the payment form validation or customize it for trials
  }

  handlePurchaseSignup(): void {
    // Logic for handling direct purchase signups
    console.log('User is signing up for a paid plan.');
    // Ensure all payment details are required
  }

  onSubmit() {
    if (
      this.signupForm.valid &&
      this.billingForm.valid &&
      (!this.isPaidPlan || this.paymentForm.valid)
    ) {
      const userDetails = {
        ...this.signupForm.value,
        ...this.billingForm.value,
        ...this.paymentForm.value,
      };

      if (this.isPaidPlan && this.route.snapshot.queryParams['action'] === 'purchase') {
        // Logic for direct purchase
        console.log('Processing purchase:', userDetails);
      } else if (this.route.snapshot.queryParams['action'] === 'trial') {
        // Logic for trial sign-up
        console.log('Processing trial signup:', userDetails);
      }

      // Send userDetails to the backend
      this.authService.signup(userDetails).subscribe(
        (response: any) => {
          this.snackbar.open('User registered. A confirmation email has been sent.', 'close', {
            duration: 3000,
          });
          // Navigate to next step or dashboard
        },
        (error) => {
          console.error('Error during signup:', error);
          this.snackbar.open(
            'An error occurred during signup. Please try again.',
            'close',
            {
              duration: 3000,
            }
          );
        }
      );
    }
  }

  verifyEmail(): void {
    const payload = {
      email: this.signupForm.get('email')?.value,
      confirmationCode: this.OTPForm.value.confirmationCode,
    };
    this.authService.emailVerification(payload).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.snackbar.open('Email Verified, Add the security question or Skip these Step', 'close', {
          duration: 3000,
        });
      },
      (error: any) => {
        console.error('error', error);
      }
    );
  }

  onUserCountChange(event: any): void {
    console.log('eveent', event);
    
    this.paymentForm.controls.numberOfUsers.setValue(event.target.value);
  }
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const date = event.value;
    if (date) {
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // MM
      const year = date.getFullYear().toString().slice(-2); // YY
      const formattedDate = `${month}/${year}`;
      this.paymentForm.get('expiryDate')?.setValue(formattedDate, { emitEvent: false });
      this.expiryDateInvalid = false; // Reset error state
    } else {
      this.expiryDateInvalid = true; // Handle invalid date
    }
    this.paymentForm.get('expiryDate')?.updateValueAndValidity();
  }

  calculatePrice(): number {
    // Implement your pricing logic here based on numUsers
    const basePrice = 10; // Example base price
    const users = this.paymentForm.value?.numberOfUsers ?? 1
    return basePrice * users
  }
  addSecurityQuestion(): void {
    if (this.securityForm.valid) {
      const formValues = this.securityForm.value;

      // Prepare the securityQuestions array from form values
      const securityQuestions = [
        {
          question: formValues.securityQuestion1,
          answer: formValues.securityAnswer1,
        },
        {
          question: formValues.securityQuestion2,
          answer: formValues.securityAnswer2,
        },
      ];

      // Call API to update security questions and answers
      this.securityQuestionService.createSecurityQuestion(securityQuestions).subscribe(
        () => {
          this.snackbar.open('Security questions updated successfully!', 'close', {
            duration: 3000,
          });
          this.router.navigateByUrl('/passwords');
        },
        (error: any) => console.error('Error updating security questions', error)
      );
    } else {
      console.log('Please fill in all required fields');
    }
  }

  generatePassword(): void {
    const passwords = Array(10)
      .fill(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
      )
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    this.signupForm.get('password')?.setValue(passwords);
    const result = zxcvbn(passwords);
    this.strength = result.score;
    this.value = (this.strength / 4) * 100;
  }

  passwordValidator(control: FormControl): { [s: string]: boolean } | null {
    const passwordValidation =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{6,}$/;
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
