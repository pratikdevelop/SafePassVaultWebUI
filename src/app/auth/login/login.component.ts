import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import axios from 'axios';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatSnackBarModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  snackbar = inject(MatSnackBar)
  router =inject(Router)
  route = inject(ActivatedRoute);
  auth = inject(AuthService)
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any)=>{
        this.loginForm.patchValue(res);
    })
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe((response)=>{
          console.log("too", response);
          
        localStorage.setItem('token', response.token);
        this.snackbar.open('Login successful', 'close'); // Assuming snackbar implementation
        this.router.navigateByUrl('/');
      }, error=>{
        console.error('Error logging in:', error);
        this.snackbar.open('Login failed: ' + error.message, 'close');
        
      })
    }
  }

}
