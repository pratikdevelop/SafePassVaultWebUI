import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordService } from '../../../../services/password.service';
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
import { ProofIdService } from '../../../../services/proof-id.service';

@Component({
  selector: 'app-idproofform',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, CommonModule, MatInputModule, MatAutocompleteModule, MatDialogModule, MatCheckboxModule, MatChipsModule, MatIconModule, MatSelectModule, MatOptionModule],
  templateUrl: './idproofform.component.html',
  styleUrl: './idproofform.component.css'
})
export class IdproofformComponent {
  idProofForm: FormGroup;

  idTypes: string[] = ['AadharCard', 'PANCard', 'Passport', 'DriverLicense', 'SocialSecurity', 'Other'];

  constructor(private fb: FormBuilder, private idProofService: ProofIdService) {
    this.idProofForm = this.fb.group({
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      issueDate: [''],
      expiryDate: [''],
      documentImageUrl: [''],
      issuedBy: ['', Validators.required]

    });

    this.onIdTypeChange();
  }

  onIdTypeChange() {
    this.idProofForm.get('idType')?.valueChanges.subscribe((idType) => {
      const idNumberControl = this.idProofForm.get('idNumber');

      if (idType === 'AadharCard') {
        idNumberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]{12}$')]);
      } else if (idType === 'PANCard') {
        idNumberControl?.setValidators([Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]);
      } else {
        idNumberControl?.setValidators([Validators.required]);
      }

      idNumberControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.idProofForm.valid) {
      this.idProofService.createProofId(this.idProofForm.value).subscribe(response => {
        console.log('ID proof created', response);
      });
    }
  }
}
