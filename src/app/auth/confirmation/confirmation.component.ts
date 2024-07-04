import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {
  OTPForm: FormGroup = new FormGroup({
    confirmationCode: new FormControl("", Validators.required),
    email:new FormControl(localStorage.getItem("email")?.toString())
  });
  route = inject(Router)
  fb = inject(FormBuilder)
  service = inject(AuthService)

  ngOnInit(): void {}
  
  onSubmit(): void {
    if (this.OTPForm.invalid) return;
    this.service.emailVerification(this.OTPForm.value).subscribe(response => {
      localStorage.setItem("token", response.token)
        this.route.navigateByUrl("/")
    }, 
    (eror: any)=>{
      console.error("error", eror);
      
    })
  }

}
