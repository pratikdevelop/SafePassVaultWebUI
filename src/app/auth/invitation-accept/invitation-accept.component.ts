import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../../services/organization.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { SecurityQuestionService } from '../../services/security-question.service';

@Component({
  selector: 'app-invitation-accept',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './invitation-accept.component.html',
  styleUrls: ['./invitation-accept.component.css'],
})
export class InvitationAcceptComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper; // Access the stepper
  passwordForm: FormGroup;
  emailForm: FormGroup;
  securityForm: FormGroup;
  invitationId!: string;
  organizationServie = inject(OrganizationService);
  readonly snacBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly securityQuestionService = inject(SecurityQuestionService);
  readonly route = inject(ActivatedRoute);
  readonly fb = inject(FormBuilder);

  constructor() {
    this.passwordForm = this.fb.group(
      {
        email: [''],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.emailForm = this.fb.group({
      OTP: ['', [Validators.required]],
    });
    this.securityForm = this.fb.group({
      securityQuestion1: new FormControl(''),
      securityAnswer1: new FormControl(''),
      securityQuestion2: new FormControl(''),
      securityAnswer2: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.invitationId = params['id']; // Get the invitation ID from the URL
    });
    // Retrieve and process invitation data from route if needed
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup?.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    console.log('fff', password === confirmPassword);

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.get('password')?.value;
      const email = this.passwordForm.get('email')?.value;
      this.organizationServie
        .updateInvitationStatus(this.invitationId, password, email)
        .subscribe((res) => {
          console.log(res);
          this.snacBar.open(
            'Invitation Accepted successfully, Please verify email'
          );
        });
    }
  }

  onSubmitEmail(): void {
    const payload = {
      email: this.passwordForm.get('email')?.value,
      confirmationCode: this.emailForm.value.OTP,
    };
    this.authService.emailVerification(payload).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.snacBar.open(
          'Email Verified, Add the security question or Skip these Step',
          'close',
          {
            duration: 3000,
          }
        );
      },
      (eror: any) => {
        console.error('error', eror);
      }
    );
  }

  addSecurityQuestion(): void {
    if (this.securityForm.invalid) return;
    this.securityQuestionService
      .createSecurityQuestion(this.securityForm.value)
      .subscribe({
        next: (response) => {
          this.snacBar.open('Security question added successfully', 'close', {
            duration: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('error', error);
          this.snacBar.open('Error adding security question', 'close', {
            duration: 3000,
          });
        },
      });
  }
}
