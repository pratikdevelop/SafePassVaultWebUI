import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { FileService } from '../../../services/file.service'; // Import your file service
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { FolderService } from '../../../services/folder.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements OnInit {
  uploadForm: FormGroup;
  filteredUsers: any[] = [];
  filteredFolders: any[] = [];
  selectedUsers: string[] = [];
  fileToUpload: File | null = null;
  folderNotFound = false;
  private readonly fb = inject(FormBuilder);
  private readonly fileService = inject(FileService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly dialogRef = inject(MatDialogRef<FileUploadComponent>);
  private readonly folderService = inject(FolderService);

  isEditMode: boolean = false;
  fileData: any; // To hold file data if editing

  constructor() {
    this.uploadForm = this.fb.group({
      _Id: [''],
      file: [''],
      folderId: [''],
      folderName: [''],
      sharedWith: [''],
      encrypted: [false],
      offlineAccess: [false],
    });
  }

  ngOnInit(): void {
    // Check if we're editing an existing file
    if (this.dialogRef._containerInstance?._config?.data) {
      console.log('dd', this.dialogRef);
      this.isEditMode = true;

      this.fileData = this.dialogRef._containerInstance._config.data; // The file data passed from the parent
      this.preFillForm();
    }
  }

  preFillForm(): void {
    // Pre-fill the form with the existing file's data
    if (this.fileData) {
      this.uploadForm.patchValue({
        _id: this.fileData._id,
        folderId: this.fileData.folderId._id,
        folderName: this.fileData.folderId.name,
        sharedWith: this.fileData.sharedWith,
        encrypted: this.fileData.encrypted,
        offlineAccess: this.fileData.offlineAccess,
      });
      this.selectedUsers = this.fileData.sharedWith || [];
    }
  }

  createFolder(folderName: string): void {
    this.folderService.createFolder({
      name: folderName,
      type: "files"
    }).subscribe(
      (folder: any) => {
        this.snackBar.open(`Folder "${folderName}" created.`, 'Close');
        this.filteredFolders.push(folder);
        this.folderNotFound = false;
        this.uploadForm.get('folderId')?.setValue(folder._id);
        this.uploadForm.get('folderName')?.setValue(folder.name);
      },
      () => {
        this.snackBar.open('Error creating folder.', 'Close');
      }
    );
  }
  removeFile(): void {
    this.fileService.removeFile(this.fileData._id).subscribe({
      next: () => {
        this.snackBar.open('File removed successfully!', 'Close');
        this.fileData = null;
        this.fileToUpload = null; // Reset selected file
        this.uploadForm.get('file')?.reset(); // Reset form field
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.snackBar.open('Error removing file.', 'Close');
      },
      complete: () => {
        // Optionally, close the dialog or take additional actions after file is removed
      }
    });
  }

  onFileChange(event: any): void {

    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
    }
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
          this.snackBar.open('Error searching folders.', 'Close');
        },
        complete: () => {
          this.changeDetectorRef.detectChanges();
        },
      });
    }
  }

  searchUsers(event: any): void {
    const input = event.target.value;
    this.fileService.searchUsers(input).subscribe((response) => {
      this.filteredUsers = response;
    });
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || (!this.fileToUpload && !this.isEditMode)) {
      this.snackBar.open('Please fill in all required fields and select a file.', 'Close');
      return;
    }

    const formData = new FormData();

    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
    }

    formData.append('folderId', this.uploadForm.get('folderId')?.value || '');
    formData.append('ownerId', this.uploadForm.get('ownerId')?.value);
    formData.append('sharedWith', JSON.stringify(this.uploadForm.get('sharedWith')?.value));
    formData.append('encrypted', this.uploadForm.get('encrypted')?.value);
    formData.append('offlineAccess', this.uploadForm.get('offlineAccess')?.value);

    if (this.isEditMode) {
      this.updateFile(formData); // Edit existing file
    } else {
      this.uploadFile(formData); // Upload a new file
    }
  }

  uploadFile(formData: FormData): void {
    this.fileService.uploadFile(formData).subscribe({
      next: (event) => {
        this.snackBar.open('File uploaded successfully!', 'Close');
        this.uploadForm.reset();
        this.fileToUpload = null;
      },
      error: (error) => {
        this.snackBar.open('Error uploading file.', 'Close', {
          duration: 2000,
        });
      },
      complete: () => {
        this.changeDetectorRef.detectChanges();
        this.dialogRef.close();
      },
    });
  }

  updateFile(formData: FormData): void {

    this.fileService.updateFileMetadata(this.uploadForm.value._id, formData).subscribe({
      next: (event) => {
        this.snackBar.open('File updated successfully!', 'Close');
        this.uploadForm.reset();
        this.fileToUpload = null;
      },
      error: (error) => {
        this.snackBar.open('Error updating file.', 'Close', {
          duration: 2000,
        });
      },
      complete: () => {
        this.changeDetectorRef.detectChanges();
        this.dialogRef.close(true);
      },
    });
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

  change(folder: { id: string }): void {
    this.uploadForm.patchValue({ folderId: folder.id });
  }
}
