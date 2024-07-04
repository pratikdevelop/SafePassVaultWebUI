import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import axios from 'axios';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,MatSnackBarModule, RouterModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  snackbar = inject(MatSnackBar)
  router =inject(Router)
  route = inject(ActivatedRoute);
  authService = inject(AuthService)
  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required,]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  ngOnInit(): void {}


  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value)
      .subscribe(
        response => {
          // Handle successful signup (e.g., redirect to login page, show success message)
          localStorage.setItem("email", this.signupForm.value.email)
          this.router.navigateByUrl("/email-confirmation")
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
  }
}
