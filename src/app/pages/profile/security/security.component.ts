import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatSelectModule, MatOptionModule],
  templateUrl: './security.component.html',
})
export class SecurityComponent {
  securityForm = new FormGroup({
    securityQuestion1: new FormControl('', Validators.required),
    securityAnswer1: new FormControl('', Validators.required),
    securityQuestion2: new FormControl('', Validators.required),
    securityAnswer2: new FormControl('', Validators.required)
  });

  onSubmit(): void {
    if (this.securityForm.valid) {
      // Call API to update security questions and answers
      console.log("ee", this.securityForm.value);
      
      console.log('Security questions and answers updated successfully!');
    } else {
      console.log('Please fill in all required fields');
    }
  }
}
