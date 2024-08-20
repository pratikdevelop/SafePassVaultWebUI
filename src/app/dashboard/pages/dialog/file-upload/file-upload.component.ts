import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileService } from '../../../../services/file.service'; // Import your file service
import { HttpEventType } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatChipListbox,
    MatAutocompleteModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    CommonModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  uploadForm: FormGroup;
  filteredUsers: any[] = [];
  filteredFolders: any[] = [];
  selectedUsers: string[] = [];
  fileToUpload: File | null = null;
  folderNotFound = false;

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      file: [''],
      folderId: [''],
      sharedWith: [''],
      encrypted: [false],
      offlineAccess: [false],
    });

    this.uploadForm.controls['sharedWith'].valueChanges.subscribe((value) => {
        this.fileService.searchUsers(value).subscribe((response) => {
          this.filteredUsers = response;
        })
      }
    );

    this.uploadForm.controls['folderId'].valueChanges.subscribe(((value) => {
        if (value) {
          const filterValue = value.toLowerCase();
          this.fileService.searchFolders(filterValue).subscribe((filtered) => {
            this.filteredFolders = filtered;
            this.folderNotFound = filtered.length === 0;
          }); // As
        }
      })
    );
  }

  createFolder(folderName: string): void {
    this.fileService.createFolder(folderName).subscribe(
      () => {
        this.snackBar.open(`Folder "${folderName}" created.`, 'Close');
        this.uploadForm.get('folderId')!.setValue(folderName);
        this.folderNotFound = false;
      },
      () => {
        this.snackBar.open('Error creating folder.', 'Close');
      }
    );
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
    }
  }
  onFolderSearch(event: any): void {
    const input = event.target.value;
    if (input) {
      this.fileService.searchFolders(input).subscribe(folders => {
        this.folderNotFound = folders.length === 0;
      });
    }
  }

  searchUsers(event: any): void {
    const input = event.target.value;
    this.fileService.searchUsers(input).subscribe((response) => {
      this.filteredUsers = response;
    })
  }


  onSubmit(): void {
    if (this.uploadForm.invalid || !this.fileToUpload) {
      this.snackBar.open(
        'Please fill in all required fields and select a file.',
        'Close'
      );
      return;
    }

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('folderId', this.uploadForm.get('folderId')?.value || '');
    formData.append('ownerId', this.uploadForm.get('ownerId')?.value);
    formData.append(
      'sharedWith',
      JSON.stringify(this.uploadForm.get('sharedWith')?.value || [])
    );
    formData.append('encrypted', this.uploadForm.get('encrypted')?.value);
    formData.append(
      'offlineAccess',
      this.uploadForm.get('offlineAccess')?.value
    );

    this.fileService.uploadFile(formData).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Handle progress if needed
        } else if (event.type === HttpEventType.Response) {
          this.snackBar.open('File uploaded successfully!', 'Close');
          this.uploadForm.reset();
          this.fileToUpload = null;
        }
      },
      (error) => {
        this.snackBar.open('Error uploading file.', 'Close');
      }
    );
  }

  removeUserOrFolder(name: string): void {
    const index = this.uploadForm.value.sharedWith.indexOf(name);
    if (index >= 0) {
      this.uploadForm.value.sharedWith.splice(index, 1);
    }
  }

  selected(event: any): void {
    this.selectedUsers.push(event.option.viewValue);
  }
  removeUser(user: string): void {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }
}
