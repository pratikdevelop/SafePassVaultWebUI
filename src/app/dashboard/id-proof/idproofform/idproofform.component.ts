import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { ProofIdService } from '../../../services/proof-id.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map, debounceTime, switchMap, catchError, Observable } from 'rxjs';
import { TagsCreationDialogComponent } from '../../../common/tags-creation-dialog/tags-creation-dialog.component';
import { CommonService } from '../../../services/common.service';
import { FolderService } from '../../../services/folder.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-idproofform',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  templateUrl: './idproofform.component.html',
  styleUrl: './idproofform.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdproofformComponent {
  checkValidDate(_date: any) {
    console.log(_date.target.value)
  }
  idProofForm: FormGroup;
  private readonly fb = inject(FormBuilder);
  private readonly proofIdService = inject(ProofIdService);
  private readonly matSnackBar = inject(MatSnackBar);
  idTypes: string[] = [
    'AadharCard',
    'PANCard',
    'Passport',
    'DriverLicense',
    'SocialSecurity',
    'Other',
  ];
  selectedTags: any = [];
  changeDetectorRef = inject(ChangeDetectorRef);
  isLoading: boolean = false;
  tags: any[] = [];
  commonService = inject(CommonService);
  folderService = inject(FolderService);
  folders: any = [];
  dialog = inject(MatDialog);

  constructor() {
    this.idProofForm = this.fb.group({
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      issueDate: [''],
      expiryDate: [''],
      documentImageUrl: [''],
      issuedBy: ['', Validators.required],
      tags: [[]],
      folderId: ['', Validators.required],
      searchTerm: [''],
      searchFolders: [''],
    });
    this.onIdTypeChange();
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (control.value && !datePattern.test(control.value)) {
      return { invalidDate: true };
    }
    return null;
  }

  onIdTypeChange() {
    this.idProofForm.get('idType')?.valueChanges.subscribe((idType) => {
      const idNumberControl = this.idProofForm.get('idNumber');

      if (idType === 'AadharCard') {
        idNumberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{12}$'),
        ]);
      } else if (idType === 'PANCard') {
        idNumberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
        ]);
      } else {
        idNumberControl?.setValidators([Validators.required]);
      }

      idNumberControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.idProofForm.valid) {
      this.proofIdService
        .createProofId(this.idProofForm.value)
        .pipe()
        .subscribe({
          next: (response) => {
            console.log('ID proof created', response);
            this.matSnackBar.open('ID proof created successfully', 'OK', {
              duration: 2000,
            });
          },
          error: (error) => {
            console.error('Error creating ID proof', error);
            this.matSnackBar.open('Error creating ID proof', 'OK', {
              duration: 2000,
            });
          },
        });
    }
  }

  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    const tags = this.idProofForm.value.tags || [];
    tags.push(event.option.value);

    this.idProofForm.controls['tags'].setValue(tags);
    this.selectedTags = tags;

    this.idProofForm.controls['searchTerm'].setValue(null);
    event.option.deselect();
    this.changeDetectorRef.detectChanges();
  }

  searchTags(): void {
    this.idProofForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchTerm: string) => {
          if (searchTerm.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.commonService
              .searchTags(searchTerm.trim().toLowerCase(), 'identity')
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
      })
  }
  searchFolders(): void {

    this.isLoading = true;

    this.idProofForm
      .get('searchFolders')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchFolders: string) => {
          if (searchFolders.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.folderService
              .searchFolders(searchFolders.trim().toLowerCase(), 'identity')
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
    this.idProofForm.get('folderId')?.setValue($event.option.value._id);
    this.idProofForm.get('searchFolders')?.setValue($event.option.value.label);
  }
  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.idProofForm.value.searchFolders,
        type: 'identity',
      })
      .subscribe({
        next: (folder: any) => {
          this.folders.push(folder)
          this.idProofForm.get('folderId')?.setValue(folder._id);
          this.idProofForm.get('searchFolders')?.setValue(folder.name);
          this.changeDetectorRef.detectChanges()
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }
  createNewTag(): void {
    this.dialog.open(TagsCreationDialogComponent, {
      width: '1400px',
      data: {
        name: this.idProofForm.value.searchTerm,
        type: 'identity'
      }
    });
  }

  removeTag(tagId: string): void {
    // Get the current tags array

    const currentTags = this.idProofForm.get('tags')?.value || [];

    // Filter out the tag by ID
    const updatedTags = currentTags.filter(
      (tag: { _id: string }) => tag._id !== tagId
    );

    // Update the tags form control with the new array
    this.idProofForm.get('tags')?.setValue(updatedTags);

    // Update the selectedTags variable
    this.selectedTags = updatedTags;

    // Log the updated selectedTags for verification
  }

}
