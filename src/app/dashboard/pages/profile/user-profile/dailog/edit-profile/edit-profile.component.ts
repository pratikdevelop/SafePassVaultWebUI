import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatToolbarModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
onSave() {
throw new Error('Method not implemented.');
}
  readonly dialogRef = inject(MatDialogRef<EditProfileComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly formBuilder = inject(FormBuilder)
  profileForm!: FormGroup

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: [''],
      email: [''],
      address:[''],
      phone: [''],
      postalCode:[''],
      city: [''],
      country: ['']
      });
    console.log('dd', this.data);
    
    this.profileForm.patchValue(this.data)
  }
  
onUpload() {
throw new Error('Method not implemented.');
}

}
