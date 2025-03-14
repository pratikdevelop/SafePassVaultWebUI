import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrganizationService } from '../../../../services/organization.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './organization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class OrganizationComponent {
  organizationForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  })
  readonly organizatioonService = inject(OrganizationService);
  readonly dialogRef = inject(MatDialogRef);
  readonly snackBar = inject(MatSnackBar);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor() {
    console.log(
      this.data
    );
    
    if (this.data) {
    this.organizatioonService.getOrganization(this.data._id).subscribe((organization) => {
      console.log(
        organization
      );
      
      this.organizationForm.patchValue 
      ({
        name: organization.organization.name,
        description: organization.organization.description,
        _id: organization.organization._id
        })
        })
      }
  }


  addOrganization(): void {
    const {name,description } = this.organizationForm.value;
    this.organizatioonService.createOrganization(name, description).subscribe({
      next: (response) => {
        console.log(response);
        this.dialogRef.close();
        this.snackBar.open('Organization created successfully', 'OK', {
          duration: 2000,
          });
      
    },
    error:(res)=>{
      this.dialogRef.close(true)
      this.snackBar.open('Error creating organization', 'OK', {
        duration: 2000,
        });
        
    }
  })
  }

  editaddOrganization(): void {
    const {name,description } = this.organizationForm.value
    this.organizatioonService.updateOrganization(this.data._id, {name, description}).subscribe
    ({
      next: (response) => {
        console.log(response);
          this.dialogRef.close(true)
          this.snackBar.open('Organization updated successfully', 'OK', {
            duration: 2000,
            });
          },
          error:(res)=>{
            this.dialogRef.close(true)
              this.snackBar.open('Error updating organization', 'OK', {
                duration: 2000,
                });
                }
                })
  }

}
