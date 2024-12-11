import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  fileData: any;
  isEditMode: any;
  selectedFormat: any;
  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  // component code here
  private readonly dialogRef = inject(MatDialogRef<SecretsManagementFormComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly secretService = inject(SecretService);
  private readonly formBuilder = inject(FormBuilder);
  newSecret: FormGroup;
  hideValue: boolean[] = []; // Array for individual key-value visibility toggles
  categories: string[] = ['API Keys', 'Certificates'];
  currentUser: string = 'John Doe'; // Example user; replace with actual data
  currentDate: Date = new Date();


  constructor() {
    this.newSecret = this.formBuilder.group({
      name: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
      description: new FormControl(''),
      format: new FormControl('text'),
      encrypt: [false],
      category: [''],
      expirationDate: [''],
      createdBy: [this.currentUser],
      createdDate: [this.currentDate],
      file: [''],
      tags: [''],
      keyValuePairs: this.formBuilder.array([this.createKeyValuePair()]), // Initial empty key-value pair
      jsonValue: ['', Validators.required],   // JSON value for JSON format
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

  createKeyValuePair(): FormGroup {
    return this.formBuilder.group({
      key: ['', Validators.required],  // Key for the secret
      value: ['', Validators.required]  // Value for the secret
    });
  }

  // Get the key-value pairs form array
  get keyValuePairs(): FormArray {
    return this.newSecret.get('keyValuePairs') as FormArray;
  }

  // Handle format change
  onFormatChange(event: any) {
    this.selectedFormat = event.value;
    // Reset form fields when format changes
    if (this.selectedFormat !== 'file') {
      this.newSecret.controls['jsonValue'].setValue('');
    }
  }

  // Add a new key-value pair
  addKeyValuePair() {
    this.keyValuePairs.push(this.createKeyValuePair());
    this.hideValue.push(true); // Add visibility toggle for new key-value pair
  }

  // Remove a key-value pair
  removeKeyValuePair(index: number) {
    this.keyValuePairs.removeAt(index);
    this.hideValue.splice(index, 1); // Remove the corresponding visibility toggle
  }

  // Handle file input change (file upload)
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileData = file;
      // Optionally, read the file contents (e.g., JSON file)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Handle file content (e.g., parse JSON)
        console.log('File contents:', e.target.result);
      };
      reader.readAsText(file);
    }
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
  // Toggle visibility of the secret value for a specific key-value pair
  toggleValueVisibility(index: number) {
    this.hideValue[index] = !this.hideValue[index];
  }
}
