import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './organization.component.html',
})
export class OrganizationComponent {
  organizationForm = new FormGroup({
    organization_name: new FormControl('', [Validators.required]),
    organization_description: new FormControl('')
  })

}
