import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, CommonModule, MatAutocompleteModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent implements OnInit {
  addressForm: FormGroup;
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly addressService = inject(AddressService);
  readonly dialogRef = inject(MatDialogRef<AddressFormComponent>);
  countries = countries;
  readonly folderService = inject(FolderService);
  readonly changeDetectorRef = inject(ChangeDetectorRef)
  folders: any[] = [];
  filteredFolders: any;
  folderNotFound: boolean = false;
  isLoading: any;

  constructor(private formBuilder: FormBuilder) {
    this.addressForm = this.formBuilder.group({

      name: ['', Validators.required],
      folder: [''],
      searchFolders: [''],
      folderName: [],
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

  ngOnInit(): void {
    console.log('address', this.data.address);

    this.addressForm.patchValue(this.data.address)
  }


  onFolderSelected($event: MatAutocompleteSelectedEvent) {
    this.addressForm.get('folder')?.setValue($event.option.value._id);
    this.addressForm.get('searchFolders')?.setValue($event.option.value.label);
  }

  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.addressForm.value.searchFolders,
        type: 'address',
      })
      .subscribe({
        next: (folder: any) => {
          this.folders.push(folder);
          this.addressForm.get('folder')?.setValue(folder._id);
          this.addressForm.get('searchFolders')?.setValue(folder.name);
          this.changeDetectorRef.detectChanges();
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }

  onFolderSearch(event: any): void {
    
    const input = event.target.value;
    if (input) {
      this.isLoading = true;
      this.folderService.searchFolders(input, 'address').subscribe({
        next: (folders) => {
          console.log('ff', folders);
          
          this.filteredFolders = folders;
          this.folderNotFound = folders.length === 0;
          this.isLoading = false
          this.changeDetectorRef.detectChanges()
        },
        error: () => {
          // this.snackBar.open('Error searching folders.', 'Close');
          this.isLoading = false;
          this.changeDetectorRef.detectChanges()
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

    if (this.data.isEditMode && this.data.address._id) {
      // Update existing address
      this.addressService.updateAddress(this.data.address._id, addressData).subscribe({
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
  change(folder: { _id: string , name: string}): void {
    this.addressForm.patchValue({ folder: folder._id , 
      searchFolders: folder.name
    });
  }

}
