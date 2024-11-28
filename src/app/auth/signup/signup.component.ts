import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PlanService } from '../../services/plan.service';
import { SecurityQuestionService } from '../../services/security-question.service';
import zxcvbn from 'zxcvbn';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import {
  NgxPayPalModule,
  IPayPalConfig,
  ICreateOrderRequest,
} from 'ngx-paypal';
import { CommonModule } from '@angular/common';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import countries from '../../country';
import { StepperOrientation } from '@angular/cdk/stepper';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatSnackBarModule,
    RouterModule,
    MatButtonModule,
    MatStepperModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    NgxPayPalModule,
    HttpClientModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {

  @ViewChild('stepper') stepper!: MatStepper; // Access the stepper
  public readonly countries = countries;
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly planService = inject(PlanService);
  private readonly securityQuestionService = inject(SecurityQuestionService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly changeDetetorRef = inject(ChangeDetectorRef);
  public isPaidPlan: boolean = false;
  public strength: number = 0;
  public value = 0;
  public hide = signal(true);
  public showSuccess = false;
  public showCancel = false;
  public showError = false;
  public userId!: string;
  public selectedPlan: any;
  public payPalConfig?: IPayPalConfig;
  signupForm: FormGroup;
  billingForm: FormGroup;
  paymentForm: FormGroup;
  OTPForm: FormGroup;
  securityForm: FormGroup;
  recoryPhasephraseForm: FormGroup;
  public stepperOrientation: StepperOrientation = 'horizontal';
  filteredCities!: any[];
  filteredStates!: any[];

  constructor() {
    this.signupForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      countryCode: new FormControl('+91', Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{10}'),
      ]),
      password: new FormControl('', [
        Validators.required,
        this.passwordValidator.bind(this),
      ]),
    });

    this.billingForm = this.formBuilder.group({
      billingAddress: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
    });

    this.paymentForm = this.formBuilder.group({
      planType: new FormControl(''),
      planId: new FormControl(''),
      plan_action: new FormControl(''),
    });

    this.OTPForm = this.formBuilder.group({
      confirmationCode: new FormControl('', Validators.required),
    });

    this.recoryPhasephraseForm = new FormGroup({
      email: new FormControl(this.signupForm.value.email, [Validators.required]),
      passphrase: new FormControl('', [Validators.required, this.passphraseValidator()])
      // Apply the custom passphrase validator
    })

    this.securityForm = this.formBuilder.group({
      securityQuestion1: new FormControl(''),
      securityAnswer1: new FormControl(''),
      securityQuestion2: new FormControl(''),
      securityAnswer2: new FormControl(''),
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.stepperOrientation = result.matches ? 'vertical' : 'horizontal';
        this.changeDetetorRef.detectChanges();
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.isPaidPlan = params['plan'] && params.plan !== 'free';
      this.paymentForm.get('planType')?.setValue(params.plan);
      const planId = params['planId'];
      if (planId) {
        this.paymentForm.get('planId')?.setValue(planId);
        this.selectPlan(planId);
      }
      this.paymentForm.get('plan_action')?.setValue(params.action);
    });
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId:
        'AXBL_2Bz7P3ArXfpL-gwlNjeXwz38eiNCrvTfrUA5efGicHbISs-ZHAW7c3q7iNzwQAFxD3HQczoXIKA',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.selectedPlan.amount,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.selectedPlan.amount,
                  },
                },
              },
              items: [
                {
                  name: this.selectedPlan.title,
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.selectedPlan.amount,
                  },
                },
              ],
            },
          ],
          billing_cycles: this.getBillingCycles(), // Dynamic billing based on user's choice
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          this.createSubscription(details);
        });
      },
      onClientAuthorization: () => {
        this.showSuccess = true;
      },
      onCancel: () => {
        this.showCancel = true;
      },
      onError: (err) => {
        this.showError = true;
        console.error('PayPal error:', err);
      },
      onClick: () => this.resetStatus(),
    };
  }

  onCountryChange(selectedCountry: string) {
    const countryData = this.countries.find(
      (country) => country.shortName === selectedCountry
    );

    if (countryData) {
      // Update the filtered cities and states based on the selected country
      this.filteredStates = countryData.states;
      // Reset city and state form controls
      this.billingForm.get('city')?.setValue('');
      this.billingForm.get('state')?.setValue('');
    }
    console.log('ff', this.filteredStates);
  }
  onStateChange(seletedState: string) {
    const state = this.filteredStates.find((state: any) => {
      return state.abbreviation === seletedState;
    });
    console.log('fff', state, seletedState);

    if (state) {
      // Update the filtered cities based on the selected state
      this.filteredCities = state.cities.map((city: string) => {
        return {
          name: city,
        };
      });
      // Reset city form control
      this.billingForm.get('city')?.setValue('');
    }
  }
  // Dynamic Billing Cycles Function
  private getBillingCycles(): any[] {
    if (this.paymentForm.value.plan_action === 'trial') {
      return [
        {
          frequency: {
            interval_unit: 'DAY',
            interval_count: 7, // 7-day trial period
          },
          tenure_type: 'TRIAL',
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: {
              value: '0',
              currency_code: 'USD',
            },
          },
        },
        {
          frequency: {
            interval_unit: this.selectedPlan.interval,
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: this.selectedPlan.amount,
              currency_code: 'USD',
            },
          },
        },
      ];
    } else {
      return [
        {
          frequency: {
            interval_unit: this.selectedPlan.interval,
            interval_count: 1, // Monthly subscription
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: this.selectedPlan.amount,
              currency_code: 'USD',
            },
          },
        },
      ];
    }
  }

  private resetStatus(): void {
    this.showSuccess = false;
    this.showCancel = false;
    this.showError = false;
  }

  selectPlan(planId: string): void {
    this.selectedPlan = this.planService.plan.find(
      (plan) => plan.id === planId
    );
    this.paymentForm.patchValue({ planType: this.selectedPlan });
    console.log('Selected Plan:', this.selectedPlan);
  }

  createSubscription(orderDetails: any): void {
    const subscriptionData = {
      userId: this.userId,
      plan: this.paymentForm.value.planType,
      paypalOrderId: orderDetails.id,
    };

    this.planService.createPlan(subscriptionData).subscribe({
      next: (response: any) => {
        this.authService.resendCode(this.signupForm.value.email).subscribe({
          next: () => {
            this.snackbar.open(
              'Subscription created successfully. The email verification code has been sent to your email. Please check your inbox.',
              'close',
              { duration: 3000 }
            );
            localStorage.setItem(
              'email',
              this.signupForm.value.email?.toString()
            );
          },
        });
      },
      error: (error: any) =>
        console.error('Error creating subscription:', error),
    });
  }



  onSubmit(): void {
    this.initConfig();


    if (
      this.signupForm.valid &&
      this.billingForm.valid &&
      (!this.isPaidPlan || this.paymentForm.valid)
    ) {
      this.createUser();
    } else {
      this.snackbar.open('Please fill in all required fields', 'close', {
        duration: 3000,
      });
    }
  }

  getPasswordStrength(): number {
    return this.value;
  }

  generatePassword(): void {
    const passwords = Array(10)
      .fill(
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
      )
      .map((x) => x[Math.floor(Math.random() * x.length)])
      .join('');
    this.signupForm.get('password')?.setValue(passwords);
    const result = zxcvbn(passwords);
    this.strength = result.score;
    this.value = (this.strength / 4) * 100;
    this.changeDetetorRef.detectChanges();
  }

  getPasswordStrengthLabel(strength: number): string {
    switch (strength) {
      case 0:
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

  createUser(): void {
    const userDetails = {
      ...this.signupForm.value,
      ...this.billingForm.value,
      ...this.paymentForm.value,
    };
    this.authService.signup(userDetails).subscribe({
      next: (response: any) => {
        this.userId = response.userId;
        if (!this.isPaidPlan) {
          this.snackbar.open(
            'User registered. A confirmation email has been sent.',
            'close',
            { duration: 3000 }
          );
          this.stepper.next(); // Moves to the next step
        }
      },
      error: (error: any) =>
        this.snackbar.open(error.message, 'close', { duration: 3000 }),
    });
  }

  private passwordValidator(
    control: FormControl
  ): { [key: string]: any } | null {
    const result = zxcvbn(control.value);
    this.strength = (result.score + 1) * 20; // Strength percentage
    return result.score < 3 ? { weakPassword: true } : null;
  }

  initPasswordStrengthWatcher(): void {
    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      const result = zxcvbn(password);
      this.strength = (result.score + 1) * 20; // Update password strength bar
    });
  }

  onConfirmOTP(): void {
    if (this.OTPForm.invalid) return;
    const payload = {
      confirmationCode: this.OTPForm.value.confirmationCode,
      email: this.signupForm.value.email
    }
    this.authService.emailVerification(payload).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.snackbar.open(
          ' User email verified. Nest step add  Security Questions',
          'close',
          { duration: 3000 }
        );
        this.stepper.next(); // Moves to the next step
      },
      (eror: any) => {
        console.error('error', eror);
      }
    );
  }
  resendCode(): void {
    this.authService.resendCode(this.signupForm.value.email).subscribe(
      () => {
        this.snackbar.open('Signup successful', 'close', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackbar.open(
          'Error occured to resend the verification code. Please try again.',
          'close',
          {
            duration: 3000,
          }
        );
      }
    );
  }

  addSecurityQuestion(): void {
    if (this.securityForm.invalid) return;
    const securityQuestions = [
      {
        question: this.securityForm.value.securityQuestion1,
        answer: this.securityForm.value.securityAnswer1
      },
      {
        question: this.securityForm.value.securityQuestion2,
        answer: this.securityForm.value.securityAnswer2
      }
    ];
    this.securityQuestionService
      .createSecurityQuestion(this.securityForm.value)
      .subscribe({
        next: (response) => {
          this.snackbar.open('Security question added successfully', 'close', {
            duration: 3000,
          });
          this.router.navigate(['/dashboard/passwords']);
        },
        error: (error) => {
          console.error('error', error);
          this.snackbar.open('Error adding security question', 'close', {
            duration: 3000,
          });
        },
      });
  }
  passphraseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Check if passphrase is long enough (e.g., at least 8 characters)
      const minLengthValid = value && value.length >= 8;
      if (!minLengthValid) {
        return { minLength: 'Passphrase must be at least 8 characters long' };
      }

      // Check for at least one uppercase letter
      const uppercaseValid = /[A-Z]/.test(value);
      if (!uppercaseValid) {
        return { uppercase: 'Passphrase must contain at least one uppercase letter' };
      }

      // Check for at least one lowercase letter
      const lowercaseValid = /[a-z]/.test(value);
      if (!lowercaseValid) {
        return { lowercase: 'Passphrase must contain at least one lowercase letter' };
      }

      // Check for at least one number
      const numberValid = /\d/.test(value);
      if (!numberValid) {
        return { number: 'Passphrase must contain at least one number' };
      }

      // Check for at least one special character
      const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      if (!specialCharValid) {
        return { specialChar: 'Passphrase must contain at least one special character' };
      }


      return null; // Passphrase is valid
    };
  }
  onSubmitPassphrase(): void {
    if (this.recoryPhasephraseForm.invalid) {
      return;
    }
    this.authService.generatePrivateKey(this.recoryPhasephraseForm.value).subscribe({
      next: (response) => {
        const blob = new Blob([response.privateKeyPEM], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'private-key.pem';
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackbar.open(
          'Private key generated successfully and downlaoded in your machine',
          'Close',
          {
            duration: 5000,
          }
        )
        this.recoryPhasephraseForm.reset();
        this.stepper.next();
        this.changeDetetorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
