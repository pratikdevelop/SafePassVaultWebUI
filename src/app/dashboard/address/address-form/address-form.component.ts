import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddressService } from '../../../address.service';
import { Address } from '../../../interfaces/address';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import countries from '../../../country'
import { FolderService } from '../../../services/folder.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, CommonModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent {
  addressForm: FormGroup;
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly addressService = inject(AddressService);
  readonly dialogRef = inject(MatDialogRef<AddressFormComponent>);
  countries = countries;
  readonly folderService = inject(FolderService);
  readonly changeDetectorRef = inject(ChangeDetectorRef)
  folders: any;
  filteredFolders: any;
  folderNotFound: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({
      name: ['', Validators.required],
      folder: [''],
      searchFolders: [''],
      title: [''],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      username: [''],
      gender: [''],
      birthday: [''],
      company: [''],
      address1: [''],
      address2: [''],
      city: [''],
      county: [''],
      state: [''],
      zipCode: [''],
      country: [''],
      timezone: [''],
      email: [''],
      phone: [''],
      phoneExtension: [''],
    });
  }

  onFolderSelected($event: MatAutocompleteSelectedEvent) {
    this.addressForm.get('folderId')?.setValue($event.option.value._id);
    this.addressForm.get('searchFolders')?.setValue($event.option.value.label);
  }

  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.addressForm.value.searchFolders,
        type: 'cards',
      })
      .subscribe({
        next: (folder: any) => {
          this.folders.push(folder);
          this.addressForm.get('folderId')?.setValue(folder._id);
          this.addressForm.get('searchFolders')?.setValue(folder.name);
          this.changeDetectorRef.detectChanges();
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }

  onFolderSearch(event: any): void {
    const input = event.target.value;
    if (input) {
      this.folderService.searchFolders(input, 'files').subscribe({
        next: (folders) => {
          this.filteredFolders = folders;
          this.folderNotFound = folders.length === 0;
        },
        error: () => {
          // this.snackBar.open('Error searching folders.', 'Close');
        },
        complete: () => {
          this.changeDetectorRef.detectChanges();
        },
      });
    }
  }


  onSubmit(): void {
    if (this.addressForm.invalid) {
      return;
    }

    const addressData: Address = this.addressForm.value;

    if (this.data.isEditMode && this.data.addressId) {
      // Update existing address
      this.addressService.updateAddress(this.data.addressId, addressData).subscribe({
        next: (response) => {
          console.log(response);
          this.dialogRef.close(true);
          // this.router.navigate(['/addresses']); // Navigate to the address list or another page
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      // Create a new address
      this.addressService.createAddress(addressData).subscribe({
        next: (response) => {
          console.log(response)
          this.dialogRef.close(true)
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }


}
