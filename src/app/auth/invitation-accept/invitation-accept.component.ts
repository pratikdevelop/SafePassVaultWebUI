import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../services/organization.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

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
    MatSnackBarModule
  ],
  templateUrl: './invitation-accept.component.html',
  styleUrls: ['./invitation-accept.component.css']
})
export class InvitationAcceptComponent implements OnInit {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  invitationId: any;
  organizationServie = inject(OrganizationService)
snacBar = inject(MatSnackBar)
authService = inject(AuthService)

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.passwordForm = this.fb.group({
      email: [''], 
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.emailForm = this.fb.group({
      OTP: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.invitationId = params['id']; // Get the invitation ID from the URL
    });
    // Retrieve and process invitation data from route if needed
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup?.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.get('password')?.value;
      const email = this.passwordForm.get('email')?.value;
      this.organizationServie.updateInvitationStatus(this.invitationId, password, email).subscribe((res)=>{
        console.log(res);
        this.snacBar.open('Invitation Accepted successfully, Please verify email')
        
      })
    }

  }

  onSubmitEmail(): void {
    const payload = {
      email: this.passwordForm.get('email')?.value, 
      confirmationCode:this.emailForm.value.OTP
    }
    this.authService.emailVerification(payload).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.snacBar.open('Email Verified, Add the security question or Skip these Step', 'close', {
          duration: 3000,
        });
      },
      (eror: any) => {
        console.error('error', eror);
      }
    );
  }
}
