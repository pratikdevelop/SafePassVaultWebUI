import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatToolbarModule, ReactiveFormsModule, FormsModule, MatSnackBarModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  readonly authService = inject(AuthService)
  readonly dialogRef = inject(MatDialogRef<EditProfileComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly formBuilder = inject(FormBuilder)
  readonly snackBar = inject(MatSnackBar);
  profileForm: FormGroup

  constructor() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      billingAddress:['', Validators.required],
      state:['', Validators.required],
      phone: ['', Validators.required],
      postalCode:['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
      });
    console.log('dd', this.data);
    
    this.profileForm.patchValue(this.data)
  }

  ngOnInit(): void {
    
  }
  updateProfile(): void {
    if(this.profileForm.invalid) {
      return;
    }
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        this.snackBar.open('Profile updated successfully', 'OK', {
          duration: 2000,
        }
      )
      this.dialogRef.close(true);
    }
    })
  }
}
