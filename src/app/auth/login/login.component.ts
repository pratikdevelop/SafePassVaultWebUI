import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import axios from 'axios';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
 

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
      axios.post("http://44.206.224.230/api/auth/login", this.loginForm.value).then((res: { data: { token: string; }; })=>{
        localStorage.setItem("token", res.data.token)
        this.snackbar.open("Login successfull", "close", )
        this.router.navigateByUrl("/");
      })
    }
  }

}
