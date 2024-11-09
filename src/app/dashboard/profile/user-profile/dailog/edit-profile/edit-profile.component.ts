import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import countries from '../../../../../country';
import { AuthService } from '../../../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, CommonModule, MatButtonModule, MatToolbarModule, ReactiveFormsModule, FormsModule, MatSnackBarModule, MatOptionModule, MatSelectModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  readonly authService = inject(AuthService)
  readonly dialogRef = inject(MatDialogRef<EditProfileComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly formBuilder = inject(FormBuilder)
  public readonly countries= countries;
  readonly snackBar = inject(MatSnackBar);
  profileForm: FormGroup
  filteredStates: any[]= [];
  filteredCities: any[] =[];

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

  onCountryChange(selectedCountry: string) {
    const countryData = this.countries.find(
      (country) => country.shortName === selectedCountry
    );

    if (countryData) {
      // Update the filtered cities and states based on the selected country
      this.filteredStates = countryData.states;
      // Reset city and state form controls
      this.profileForm.get('city')?.setValue('');
      this.profileForm.get('state')?.setValue('');
    }
    console.log('ff', this.filteredStates);
  }
  onStateChange(seletedState: string) {
    const state = this.filteredStates.find((state: any) => {
      return state.abbreviation === seletedState;
    });
    console.log('fff', state, seletedState);

    if (state) {
      // Update the filtered cities based on the selected state
      this.filteredCities = state.cities.map((city: string) => {
        return {
          name: city,
        };
      });
      // Reset city form control
      this.profileForm.get('city')?.setValue('');
    }
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
