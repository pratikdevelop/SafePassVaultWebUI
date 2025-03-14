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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, CommonModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userForm: FormGroup;
  organizations: any[] = [];
  coutries = countries;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private organizationService: OrganizationService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

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
      this.organizationService.sendInvitation(this.userForm.value.organization, this.userForm.value).subscribe({
        next: (res) => {
          this.dialogRef.close(this.userForm.value);
          this.snackBar.open(
            'Invitation sent successfully',
            'Close',
            {
              duration: 3000,
            }
          )
        },
        error: (error) => {
          console.error('Error on adding the user, e:', error);
          this.snackBar.open(
            'Error sending invitation',
            'Close',
            {
              duration: 3000,
              direction: "ltr"
            }
          )
          this.dialogRef.close(null)

        }

      })
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
