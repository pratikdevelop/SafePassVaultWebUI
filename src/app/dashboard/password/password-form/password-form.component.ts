import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  ValidatorFn,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PasswordService } from '../../../services/password.service';
import { AES } from 'crypto-js';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { FolderService } from '../../../services/folder.service';
import { TagsCreationDialogComponent } from '../../../common/tags-creation-dialog/tags-creation-dialog.component';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-password-form',
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
    MatSnackBarModule,
  ],
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent implements OnInit {
  isLoading = false;
  passwordForm: FormGroup;
  searchTermSubject = new Subject<string>();
  private readonly dialog = inject(MatDialog);
  private readonly formbuilder = inject(FormBuilder);
  private readonly passwordService = inject(PasswordService);
  private readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly detectorRef = inject(ChangeDetectorRef);
  private readonly dialogRef = inject(MatDialogRef<PasswordFormComponent>);
  private readonly folderService = inject(FolderService);
  private readonly commonService = inject(CommonService);
  tags: any[] = [];
  folders: any[] = [];
  selectedTags: any[] = [];
  filterFolders: any[] = [];

  constructor() {
    this.passwordForm = this.formbuilder.group({
      _id: new FormControl(''),
      name: new FormControl(''),
      description: new FormControl(''),
      folderId: new FormControl(this.data.folderId),
      website: new FormControl('', [Validators.required, this.urlValidator()]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        this.strongPasswordValidator(),
      ]),
      tags: new FormControl(),
      searchTerm: new FormControl(''),
      searchFolders: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.folderService.getFoldersByType('passwords').subscribe((folders) => {
      console.log('folders', folders);

      this.folders = folders;
      this.filterFolders = folders;
      console.log('folders', this.folders);
    });
  }

  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    const tags = this.passwordForm.value.tags || [];
    tags.push(event.option.value);
    this.passwordForm.controls['tags'].setValue(tags);
    this.selectedTags = tags;

    this.passwordForm.controls['searchTerm'].setValue(null);
    event.option.deselect();
    this.detectorRef.detectChanges();
  }

  searchTags(): void {
    this.passwordForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchTerm: string) => {
          if (searchTerm.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.commonService
              .searchTags(searchTerm.trim().toLowerCase(), 'passwords')
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

  onFolderSelected(event: MatAutocompleteSelectedEvent): void {
    this.passwordForm.get('folderId')?.setValue(event.option.value._id);
    this.passwordForm.get('searchFolders')?.setValue(event.option.value.label);
  }

  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.passwordForm.value.searchFolders,
        type: 'passwords',
      })
      .subscribe({
        next: (folder: any) => {
          this.passwordForm.get('folderId')?.setValue(folder._id);
          this.passwordForm.get('searchFolders')?.setValue(folder.name);
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }

  addPassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const fixedKey = this.passwordForm.value._id
      ? this.data.password.key
      : this.generateSecureKey(32);
    const encryptedPassword = AES.encrypt(
      this.passwordForm.value.password || '',
      fixedKey
    ).toString();

    const newPasswordObject = {
      website: this.passwordForm.value.website,
      username: this.passwordForm.value.username,
      password: encryptedPassword,
      key: fixedKey,
      name: this.passwordForm.value.name,
      tags: this.passwordForm.value.tags,
      description: this.passwordForm.value.description,
      folderId: this.passwordForm.value.folderId,
    };

    if (!this.passwordForm.value._id) {
      this.passwordService.addPassword(newPasswordObject).subscribe(() => {
        this.passwordForm.reset();
        this.dialogRef.close(true);
      });
    } else {
      this.passwordService
        .updatePassword(this.passwordForm.value._id, newPasswordObject)
        .subscribe(() => {
          this.passwordForm.reset();
          this.dialogRef.close(true);
        });
    }
  }

  generateSecureKey(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }

  createNewTag(): void {
    const dialogRef = this.dialog.open(TagsCreationDialogComponent, {
      width: '1400px',
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.passwordForm.value.tags.push(result);
          this.passwordForm.get('tags')?.setValue(this.passwordForm.value.tags);
        }
      },
      error: (error) => console.error('Error:', error),
    });
  }

  removeTag(tagId: string): void {
    const currentTags = this.passwordForm.get('tags')?.value || [];
    const updatedTags = currentTags.filter(
      (tag: { _id: string }) => tag._id !== tagId
    );
    this.passwordForm.get('tags')?.setValue(updatedTags);
    this.selectedTags = updatedTags;
  }

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}/;
      return regex.test(control.value) ? null : { strongPassword: true };
    };
  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const urlRegex =
        /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return urlRegex.test(control.value) ? null : { url: true };
    };
  }
  searchFolders(): void {
    this.passwordForm
      .get('searchFolders')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchFolders: string) => {
          if (searchFolders.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.folderService
              .searchFolders(searchFolders.trim().toLowerCase(), 'passwords')
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
}
