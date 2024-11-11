import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ProofIdService } from '../../../services/proof-id.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-idproofform',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
  ],
  templateUrl: './idproofform.component.html',
  styleUrl: './idproofform.component.css',
})
export class IdproofformComponent {
  idProofForm: FormGroup;
  private readonly fb = inject(FormBuilder);
  private readonly proofIdService = inject(ProofIdService);
  private readonly matSnackBar = inject(MatSnackBar);
  idTypes: string[] = [
    'AadharCard',
    'PANCard',
    'Passport',
    'DriverLicense',
    'SocialSecurity',
    'Other',
  ];

  constructor() {
    this.idProofForm = this.fb.group({
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      issueDate: [''],
      expiryDate: [''],
      documentImageUrl: [''],
      issuedBy: ['', Validators.required],
    });
    this.onIdTypeChange();
  }

  onIdTypeChange() {
    this.idProofForm.get('idType')?.valueChanges.subscribe((idType) => {
      const idNumberControl = this.idProofForm.get('idNumber');

      if (idType === 'AadharCard') {
        idNumberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{12}$'),
        ]);
      } else if (idType === 'PANCard') {
        idNumberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
        ]);
      } else {
        idNumberControl?.setValidators([Validators.required]);
      }

      idNumberControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.idProofForm.valid) {
      this.proofIdService
        .createProofId(this.idProofForm.value)
        .pipe()
        .subscribe({
          next: (response) => {
            console.log('ID proof created', response);
            this.matSnackBar.open('ID proof created successfully', 'OK', {
              duration: 2000,
            });
          },
          error: (error) => {
            console.error('Error creating ID proof', error);
            this.matSnackBar.open('Error creating ID proof', 'OK', {
              duration: 2000,
            });
          },
        });
    }
  }
}
