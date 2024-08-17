import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrganizationService } from '../../../services/organization.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './organization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class OrganizationComponent {
  organizationForm = new FormGroup({
    organization_name: new FormControl('', [Validators.required]),
    organization_description: new FormControl('')
  })
  organizatioonService = inject(OrganizationService);

  addOrganization(): void {
    const {organization_name,organization_description } = this.organizationForm.value;
    this.organizatioonService.createOrganization(organization_name, organization_description).subscribe((res)=>{
      console.log("res", res);
      
    })
  }

}
