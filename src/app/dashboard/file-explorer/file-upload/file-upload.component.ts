import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileService } from '../../../services/file.service'; // Import your file service
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { FolderService } from '../../../services/folder.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
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
    DragDropModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly data = inject<any>(MAT_DIALOG_DATA);

  isEditMode: boolean = false;
  fileData: any; // To hold file data if editing
  isFileOver: boolean = false;

  constructor() {
    this.uploadForm = this.fb.group({
      _Id: [''],
      name: ['', Validators.required],
      file: [''],
      folderId: [''],
      folderName: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // Check if we're editing an existing file
    if (this.data) {
      console.log('ddd', this.data);

      this.isEditMode = true;
      this.fileData = this.data; // The file data passed from the parent
      this.preFillForm();
    }
  }

  preFillForm(): void {
    // Pre-fill the form with the existing file's data
    if (this.fileData) {
      this.uploadForm.patchValue({
        _id: this.fileData._id,
        folderId: this.fileData.folderId?._id,
        folderName: this.fileData.folderId?.name,
        name: this.fileData.name,
        notes: this.fileData.notes,
      });
    }
  }

  createFolder(folderName: string): void {
    this.folderService
      .createFolder({
        name: folderName,
        type: 'files',
      })
      .subscribe(
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
      },
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

  onSubmit(): void {
    if (this.uploadForm.invalid || (!this.fileToUpload && !this.isEditMode)) {
      this.snackBar.open(
        'Please fill in all required fields and select a file.',
        'Close'
      );
      return;
    }

    const formData = new FormData();

    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
    }

    formData.append('folderId', this.uploadForm.get('folderId')?.value || '');
    formData.append('ownerId', this.uploadForm.get('ownerId')?.value);
    formData.append('notes', this.uploadForm.get('notes')?.value);
    formData.append('name', this.uploadForm.get('name')?.value);

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
    this.fileService
      .updateFileMetadata(this.uploadForm.value._id, formData)
      .subscribe({
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

  change(folder: any): void {
    this.uploadForm.patchValue({ folderId: folder._id, nmae: folder.name });

  }
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isFileOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.fileData = { filename: file.name, file };
      this.fileToUpload = file;

      // Log the file information (optional)
      console.log(`File dropped: ${file.name}`);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isFileOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isFileOver = false;
  }
}
