import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SecretService } from '../../../../services/secret.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-secrets-management-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatCardModule,
    MatNativeDateModule,
  ],
  templateUrl: './secrets-management-form.component.html',
  styleUrl: './secrets-management-form.component.css'
})
export class SecretsManagementFormComponent {
  // component code here
  private readonly dialogRef = inject(MatDialogRef<SecretsManagementFormComponent>);
  private  readonly data  = inject(MAT_DIALOG_DATA);
  private readonly secretService =inject(SecretService);
  private readonly formBuilder = inject(FormBuilder);
  newSecret: FormGroup;
  hideValue: boolean = true;
  categories: string[] = ['API Keys', 'Passwords', 'Personal Notes', 'Certificates'];
  currentUser: string = 'John Doe'; // Example user; replace with actual data
  currentDate: Date = new Date();


  constructor() {
    this.newSecret = this.formBuilder.group({
      name: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
      description: new FormControl(''),
      encrypt: [false],
      category: [''],
      expirationDate: [''],
      createdBy: [this.currentUser],
      createdDate: [this.currentDate],
    
    });

  }

  addSecret() {
    this.secretService.createSecret(this.newSecret.value).subscribe({
      next: (response) => {
        console.log(response);
        this.dialogRef.close(
          {
            secret: response
            }
        )
    },
    error: (error) => {
      console.error(error);
      }
      });
  }

  onReset() {
    this.newSecret.reset({
      name: '',
      type: '',
      value: '',
      encrypt: false,
      description: '',
      category: '',
      expirationDate: '',
      createdBy: this.currentUser,
      createdDate: this.currentDate,
    });
  }
  toggleValueVisibility() {
    this.hideValue = !this.hideValue;
  }

}
