import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrganizationService } from '../../../../services/organization.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import countries from '../../../../country';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userForm: FormGroup;
  organizations: any[] = [];
  coutries = countries;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneExtension: ['', Validators.required],
      phone: ['', Validators.required],
      organization: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.organizationService.getOrganizations().subscribe(
      (data: any) => {
        this.organizations = data;
      },
      (error: any) => {
        console.error('Error loading organizations:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Handle form submission logic here
      this.organizationService.sendInvitation(this.userForm.value.organization, this.userForm.value).subscribe((res) => {
        this.dialogRef.close(this.userForm.value);

      })
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
