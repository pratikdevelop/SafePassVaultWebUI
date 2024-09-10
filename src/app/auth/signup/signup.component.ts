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
  MatProgressBarModule
} from '@angular/material/progress-bar';
import { SecurityQuestionService } from '../../services/security-question.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxStripeModule, StripeService } from 'ngx-stripe';
import { loadStripe, Stripe, StripeCardElement, StripeElements, Token } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { PlanService } from '../../services/plan.service';

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
  readonly snackbar = inject(MatSnackBar);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);
  readonly securityQuestionService = inject(SecurityQuestionService);
  readonly stripeService = inject(StripeService);
  readonly planService = inject(PlanService);
  token!: Token;

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
    numberOfUsers: new FormControl(1),
    plan_action: new FormControl(''),
  });

  OTPForm = new FormGroup({
    confirmationCode: new FormControl('', Validators.required),
  });

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
      this.stripe = await loadStripe(environment.stripe_api_key);
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

      const planId = params['planId'];
      if (planId) {
        this.paymentForm.get('planId')?.setValue(planId);
      }
      this.paymentForm.get('plan_action')?.setValue(params.action)
    });
  }

  async createToken(): Promise<void> {
    if (this.stripe && this.cardElement) {
      const tokenResult = await this.stripe.createToken(this.cardElement);

      if (tokenResult.error) {
        console.error(tokenResult.error.message);
        this.snackbar.open('Error creating payment token. Please try again.', 'close', { duration: 3000 });
      } else {
        this.token = tokenResult.token;
      }
    } else {
      console.error('Stripe or form is not valid');
    }
  }
  getPayment(): void {
    const planDetails = {
      token: this.token,
      planId: this.route.snapshot.queryParams['planId'], 
    };

    this.planService.createPlan(planDetails).subscribe(
      async (response: any) => {
        if (response.requiresAction && response.clientSecret) {
          // Handle 3D Secure or any further payment authentication
          await this.handle3DSecure(response.clientSecret);
        } else {
         
        }
      },
      (error) => {
        console.error('Error during signup:', error);
        this.snackbar.open('An error occurred during signup. Please try again.', 'close', { duration: 3000 });
      }
    );
  }

  async handle3DSecure(clientSecret: string): Promise<void> {
    const { error, paymentIntent } = await this.stripe!.confirmCardPayment(clientSecret);
    
    if (error) {
      console.error('3D Secure authentication failed:', error.message);
      this.snackbar.open('Payment authentication failed. Please try again.', 'close', { duration: 3000 });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
      this.snackbar.open('Payment and signup completed successfully.', 'close', { duration: 3000 });
      this.router.navigateByUrl('/auth/email-confirmation');
    } else {
      console.log('Payment failed or requires additional action.');
    }
  }

  onSubmit() {
    if (
      this.signupForm.valid &&
      this.billingForm.valid &&
      (!this.isPaidPlan || this.paymentForm.valid)
    ) {
      if (this.isPaidPlan && this.route.snapshot.queryParams['action'] === 'purchase') {
        this.getPayment(); 
      } else if (this.route.snapshot.queryParams['action'] === 'trial'  || !this.route.snapshot.queryParams['action']) {

        this.createUser();
      }
    }
  }


  onUserCountChange(event: any): void {
    this.paymentForm.controls.numberOfUsers.setValue(event.target.value);
  }

  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) {
      return null;
    }

    const isValid = password.length >= 8;
    return isValid ? null : { invalidPassword: true };
  }

  getPasswordStrength(): number {
    return this.value;
  }

  generatePassword(): void {
    const passwords = Array(10)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$')
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
    const basePrice = 10; 
    const users = this.paymentForm.value?.numberOfUsers ?? 1;
    return basePrice * users;
  }

  createUser(): void {
    const userDetails = {
      ...this.signupForm.value,
      ...this.billingForm.value,
      ...this.paymentForm.value,
      ... this.token
    }
    this.authService.signup(userDetails).subscribe({
      next: (response) => {
        console.log(response);
        this.snackbar.open('User registered. A confirmation email has been sent.', 'close', { duration: 3000 });
        localStorage.setItem('email', this.signupForm.value.email);
        this.router.navigateByUrl('/auth/email-confirmation');
        },
        error: (error) => {
          console.error(error);
          }

    })
  }
}

