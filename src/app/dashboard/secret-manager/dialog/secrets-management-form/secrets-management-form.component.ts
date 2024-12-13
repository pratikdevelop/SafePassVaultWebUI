import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SecretService } from '../../../../services/secret.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FolderService } from '../../../../services/folder.service';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, switchMap, map, catchError, Observable } from 'rxjs';
import { TagsCreationDialogComponent } from '../../../../common/tags-creation-dialog/tags-creation-dialog.component';
import { CommonService } from '../../../../services/common.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-secrets-management-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatCardModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCommonModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  templateUrl: './secrets-management-form.component.html',
  styleUrl: './secrets-management-form.component.css'
})
export class SecretsManagementFormComponent {

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  // component code here
  private readonly dialogRef = inject(MatDialogRef<SecretsManagementFormComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly secretService = inject(SecretService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly folderService = inject(FolderService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly commonService = inject(CommonService);

  secretsForm: FormGroup;
  hideValue: boolean[] = []; // Array for individual key-value visibility toggles
  categories: string[] = ['API Keys', 'Certificates'];
  currentDate: Date = new Date();
  fileData: any;
  isEditMode: any;
  selectedFormat: any = 'text';
  folders: any = [];
  selectedTags: any = [];
  isLoading: boolean = true;
  tags: any[] = [];

  constructor() {
    this.secretsForm = this.formBuilder.group({
      name: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
      description: new FormControl(''),
      format: new FormControl('text'),
      encrypt: [false],
      category: [''],
      expirationDate: [''],
      createdDate: [this.currentDate],
      file: [''],
      tags: new FormControl([]),
      folderId: new FormControl('', Validators.required),
      searchTerm: new FormControl(null),
      searchFolders: new FormControl(null),
      keyValuePairs: this.formBuilder.array([this.createKeyValuePair()]), // Initial empty key-value pair
      jsonValue: ['', Validators.required],   // JSON value for JSON format
    });

  }

  addSecret() {
    this.secretService.createSecret(this.secretsForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.dialogRef.close(
          {
            secret: response
          }
        )
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  createKeyValuePair(): FormGroup {
    return this.formBuilder.group({
      key: ['', Validators.required],  // Key for the secret
      value: ['', Validators.required]  // Value for the secret
    });
  }

  // Get the key-value pairs form array
  get keyValuePairs(): FormArray {
    return this.secretsForm.get('keyValuePairs') as FormArray;
  }

  // Handle format change
  onFormatChange(event: any) {
    this.selectedFormat = event.value;
    // Reset form fields when format changes
    if (this.selectedFormat !== 'file') {
      this.secretsForm.controls['jsonValue'].setValue('');
    }
  }

  // Add a new key-value pair
  addKeyValuePair() {
    this.keyValuePairs.push(this.createKeyValuePair());
    this.hideValue.push(true); // Add visibility toggle for new key-value pair
  }

  // Remove a key-value pair
  removeKeyValuePair(index: number) {
    this.keyValuePairs.removeAt(index);
    this.hideValue.splice(index, 1); // Remove the corresponding visibility toggle
  }

  // Handle file input change (file upload)
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileData = file;
      // Optionally, read the file contents (e.g., JSON file)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Handle file content (e.g., parse JSON)
        console.log('File contents:', e.target.result);
      };
      reader.readAsText(file);
    }
  }

  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    const tags = this.secretsForm.value.tags || [];
    tags.push(event.option.value);

    this.secretsForm.controls['tags'].setValue(tags);
    this.selectedTags = tags;

    this.secretsForm.controls['searchTerm'].setValue(null);
    event.option.deselect();
    this.changeDetectorRef.detectChanges();
  }

  searchTags(): void {
    this.secretsForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchTerm: string) => {
          if (searchTerm.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.commonService
              .searchTags(searchTerm.trim().toLowerCase(), 'notes')
              .pipe(
                map((tags: any[]) =>
                  tags.map((tag) => ({ name: tag.name, _id: tag._id }))
                ),
                catchError((error) => {
                  console.error('Error searching tags:', error);
                  this.isLoading = false;
                  return []; // Return an empty array in case of error
                })
              );
          } else {
            // If the search term is empty, return an empty array and stop loading
            this.isLoading = false;
            return new Observable<any[]>((observer) => {
              observer.next([]); // Emit an empty array
              observer.complete();
            });
          }
        })
      )
      .subscribe({
        next: (tags: any[]) => {
          this.tags = tags;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
        },
      });
  }
  searchFolders(): void {
    this.secretsForm
      .get('searchFolders')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchFolders: string) => {
          if (searchFolders.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.folderService
              .searchFolders(searchFolders.trim().toLowerCase(), 'notes')
              .pipe(
                catchError((error) => {
                  console.error('Error searching folders:', error);
                  this.isLoading = false;
                  return []; // Return an empty array in case of error
                })
              );
          } else {
            this.isLoading = false;
            return new Observable<any[]>((observer) => {
              observer.next([]); // Emit an empty array
              observer.complete();
            });
          }
        })
      )
      .subscribe({
        next: (folders: any[]) => {
          this.folders = folders;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
        },
      });
  }

  onFolderSelected($event: MatAutocompleteSelectedEvent) {
    this.secretsForm.get('folderId')?.setValue($event.option.value._id);
    this.secretsForm.get('searchFolders')?.setValue($event.option.value.label);
  }
  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.secretsForm.value.searchFolders,
        type: 'notes',
      })
      .subscribe({
        next: (folder: any) => {
          this.folders.push(folder)
          this.secretsForm.get('folderId')?.setValue(folder._id);
          this.secretsForm.get('searchFolders')?.setValue(folder.name);
          this.changeDetectorRef.detectChanges()
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }
  createNewTag(): void {
    this.dialog.open(TagsCreationDialogComponent, {
      width: '1400px',
      data: {
        name: this.secretsForm.value.searchTerm,
        type: 'notes'
      }
    });
  }

  removeTag(tagId: string): void {
    // Get the current tags array

    const currentTags = this.secretsForm.get('tags')?.value || [];

    // Filter out the tag by ID
    const updatedTags = currentTags.filter(
      (tag: { _id: string }) => tag._id !== tagId
    );

    // Update the tags form control with the new array
    this.secretsForm.get('tags')?.setValue(updatedTags);

    // Update the selectedTags variable
    this.selectedTags = updatedTags;

    // Log the updated selectedTags for verification
  }

  onReset() {
    this.secretsForm.reset();
  }
  // Toggle visibility of the secret value for a specific key-value pair
  toggleValueVisibility(index: number) {
    this.hideValue[index] = !this.hideValue[index];
  }
}
