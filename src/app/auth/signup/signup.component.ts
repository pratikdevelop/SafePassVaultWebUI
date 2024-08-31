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
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { loadStripe, Stripe, StripeCardElement, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';

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
    NgxStripeModule
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
  stripeService = inject(StripeService);

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
    planId: new FormControl(''),
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
  stripe: Stripe | null = null;
  elements: StripeElements | undefined = undefined;
  cardElement!: StripeCardElement;

  constructor() {
    this.integrateStripe();
  }

  async integrateStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe('pk_test_51PrEnfAE6VGXmCKJI927mwY0Ws03UDVaV19lG0UwrRG70re2SyIqxgKEsYfjsNFXnfKsVIemRpeCFDKkT3hroeCh001ivYn2hO');
      this.elements = this.stripe?.elements();
      this.cardElement = this.elements!.create('card');
      this.cardElement.mount('#card-element');
    } catch (error) {
      console.error('Error loading Stripe:', error);
    }
  }

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
      this.isPaidPlan = params['plan'] && params.plan !== 'free';
      this.paymentForm.get('planType')?.setValue(params.plan);

      // Assuming planId is part of the query params
      const planId = params['planId'];
      if (planId) {
        this.paymentForm.get('planId')?.setValue(planId);
      }

      if (params.action === 'trial') {
        this.handleTrialSignup();
      } else if (params.action === 'purchase') {
        this.handlePurchaseSignup();
      }
    });
  }

  handleTrialSignup(): void {
    console.log('User is signing up for a trial.');
  }

  handlePurchaseSignup(): void {
    console.log('User is signing up for a paid plan.');
  }

  async createToken(): Promise<void> {
    if (this.stripe && this.cardElement) {
      const tokenResult = await this.stripe.createToken(this.cardElement);

      if (tokenResult.error) {
        console.error(tokenResult.error.message);
        // Handle error (show error message to user, etc.)
        this.snackbar.open('Error creating payment token. Please try again.', 'close', { duration: 3000 });
      } else {
        const token = tokenResult.token;
        console.log('Token created successfully:', token);
        // Send the token to your backend
        this.sendTokenToBackend(token.id);
      }
    } else {
      console.error('Stripe or form is not valid');
    }
  }

  sendTokenToBackend(token: string): void {
    const userDetails = {
      ...this.signupForm.value,
      ...this.billingForm.value,
      ...this.paymentForm.value,
      token,
      planId: this.route.snapshot.queryParams['planId'] // Add planId here
    };

    this.authService.signup(userDetails).subscribe(
      (response: any) => {
        this.snackbar.open('User registered. A confirmation email has been sent.', 'close', {
          duration: 3000,
        });
        localStorage.setItem('email', this.signupForm.value.email)
        this.router.navigateByUrl('/auth/email-confirmation'); // Redirect after successful signup
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

  onSubmit() {
    if (
      this.signupForm.valid &&
      this.billingForm.valid &&
      (!this.isPaidPlan || this.paymentForm.valid)
    ) {
      if (this.isPaidPlan && this.route.snapshot.queryParams['action'] === 'purchase') {
        this.createToken(); // Create token and send it to backend
      } else if (this.route.snapshot.queryParams['action'] === 'trial') {
        this.handleTrialSignup(); // Handle trial signup
      }
    }
  }

  // verifyEmail(): void {
  //   const payload = {
  //     email: this.signupForm.get('email')?.value,
  //     confirmationCode: this.OTPForm.value.confirmationCode,
  //   };
  //   this.authService.emailVerification(payload).subscribe(
  //     (response) => {
  //       localStorage.setItem('token', response.token);
  //       this.snackbar.open('Email Verified, Add the security question or Skip this Step', 'close', {
  //         duration: 3000,
  //       });
  //     },
  //     (error: any) => {
  //       console.error('error', error);
  //     }
  //   );
  // }

  onUserCountChange(event: any): void {
    this.paymentForm.controls.numberOfUsers.setValue(event.target.value);
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

  getPasswordStrength(): number {
    return this.value;
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
  calculatePrice(): number {
    // Implement your pricing logic here based on numUsers
    const basePrice = 10; // Example base price
    const users = this.paymentForm.value?.numberOfUsers ?? 1
    return basePrice * users
  }
}
