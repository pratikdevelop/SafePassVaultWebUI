import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrganizationService } from '../../../../services/organization.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    organization_name: new FormControl('', [Validators.required]),
    organization_description: new FormControl('')
  })
  readonly organizatioonService = inject(OrganizationService);
  readonly dialogRef = inject(MatDialogRef);
  readonly snackBar = inject(MatSnackBar);

  addOrganization(): void {
    const {organization_name,organization_description } = this.organizationForm.value;
    this.organizatioonService.createOrganization(organization_name, organization_description).subscribe({
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

}
