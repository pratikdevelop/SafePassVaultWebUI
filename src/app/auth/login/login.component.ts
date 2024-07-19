import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  route = inject(ActivatedRoute);
  auth = inject(AuthService)
  hide = signal(true);
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      this.loginForm.patchValue(res);
    })
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe((response) => {
        localStorage.setItem('token', response.token);
        this.snackbar.open('Login successful', 'close'); // Assuming snackbar implementation
        this.router.navigateByUrl('/');
      }, error => {
        console.error('Error logging in:', error);
        this.snackbar.open('Login failed: ' + error.message, 'close');

      })
    }
  }

}
