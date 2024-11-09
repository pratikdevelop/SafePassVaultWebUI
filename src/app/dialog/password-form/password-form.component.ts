import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { AES } from 'crypto-js';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { debounceTime, every, map, switchMap, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { FolderService } from '../../services/folder.service';

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
  encapsulation: ViewEncapsulation.None,
})
export class PasswordFormComponent implements OnInit {
  isLoading: boolean = false;
  passwordForm: FormGroup;
  searchTermSubject: Subject<string> = new Subject<string>();
  readonly dialog = inject(MatDialog);
  readonly formbuilder = inject(FormBuilder);
  readonly passwordService = inject(PasswordService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly detectorRef = inject(ChangeDetectorRef);
  readonly dialogRef = inject(MatDialogRef<PasswordFormComponent>);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly tagsName = signal(['']);
  readonly folderService = inject(FolderService);
  tags: any[] = [];
  folders: any[] = [];
  selectedTags: any[] = [];

  constructor() {
    this.passwordForm = this.formbuilder.group({
      _id: new FormControl(),
      name: new FormControl(''),
      description: new FormControl(''),
      folderId: new FormControl(this.data.folderId),
      website: new FormControl('', [Validators.required, this.urlValidator()]), // Added URL validation
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        this.strongPasswordValidator(),
      ]), // Added strong password validation
      tags: new FormControl(),
      searchTerm: new FormControl(''),
      searchFolders: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.passwordForm.patchValue(this.data.password);
    this.data?.password?.tags.forEach((tag: any) => {
      this.selectedTags.push([...this.selectedTags, tag]);
    });
    this.folderService.folderSubject$.subscribe((folders: any) => {
      this.folders = folders || [];
      const folder = this.folders.find((folder: any) => {
        return folder._id === this.passwordForm.controls['folderId'].value;
      });

      if (folder) {
        this.passwordForm.patchValue({
          folderId: folder._id,
          searchFolders: folder.label,
        });
        return;
      } else {
        this.passwordForm.patchValue({
          folderId: this.folders[0]._id,
          searchFolders: this.folders[0].label,
        });
      }
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
    const searchTerm = this.passwordForm.value.searchTerm?.trim().toLowerCase();
    if (searchTerm) {
      this.isLoading = true;
      this.passwordService
        .searchTags(searchTerm)
        .pipe(
          map((value: any[]) =>
            value.map((tag: any) => ({ name: tag.name, _id: tag._id }))
          )
        )
        .subscribe({
          next: (tags: any[]) => {
            this.tags = tags;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error searching tags:', error);
            this.isLoading = false;
          },
        });
    } else {
      this.tags = []; // Clear tags if search term is empty
      this.isLoading = false;
    }
  }
  searchFolders(): void {}

  onFolderSelected($event: MatAutocompleteSelectedEvent) {

    this.passwordForm.get('folderId')?.setValue($event.option.value._id);
    this.passwordForm.get('searchFolders')?.setValue($event.option.value.label);
  }
  createNewFolder(): void {
    this.folderService.createFolder({
      name: this.passwordForm.value.searchFolders,
      type: 'passwords',
    }).subscribe({
      next: (folder: any) => {
        this.passwordForm.get('folderId')?.setValue(folder._id);
        this.passwordForm.get('searchFolders')?.setValue(folder.name);
      },
      error: (error: any) => console.error('Error creating folder:', error),
      
    })
  }

  addPassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }
    const fixedKey = this.passwordForm?.value._id
      ? this.data?.password.key
      : this.generateSecureKey(32);
    const encryptedPassword = AES.encrypt(
      this.passwordForm?.value?.password ?? '',
      fixedKey
    );
    // Create the new password object
    const newPasswordObject = {
      website: this.passwordForm?.get('website')?.value,
      username: this.passwordForm?.get('username')?.value,
      password: encryptedPassword.toString(),
      key: fixedKey,
      name: this.passwordForm.value.name,
      tags: this.passwordForm.value.tags,
      description: this.passwordForm.value.description,
      folderId: this.passwordForm.value.folderId,
    };

    if (!this.passwordForm?.value._id) {
      this.passwordService
        .addPassword(newPasswordObject)

        .subscribe(() => {
          this.passwordForm?.reset(); // Clear the form
          this.dialogRef.close(true);
        });
    } else {
      // Update the password using an observable
      this.passwordService
        .updatePassword(this.passwordForm?.value._id, newPasswordObject)

        .subscribe(() => {
          this.passwordForm?.reset(); // Clear the form
          this.dialogRef.close(true);
        });
    }
    // Send the new password object to the backend using an observable
  }

  generateSecureKey(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let key = '';
    for (let i = 0; i < length; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }
  createNewTag(): void {
    const dialogRef = this.dialog.open(TagFormCompoent, {
      width: '1400px',
    });
  }

  removeTag(tagId: string): void {
    // Get the current tags array

    const currentTags = this.passwordForm.get('tags')?.value || [];

    // Filter out the tag by ID
    const updatedTags = currentTags.filter(
      (tag: { _id: string }) => tag._id !== tagId
    );

    // Update the tags form control with the new array
    this.passwordForm.get('tags')?.setValue(updatedTags);

    // Update the selectedTags variable
    this.selectedTags = updatedTags;

    // Log the updated selectedTags for verification
  }

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}/;
      return regex.test(password) ? null : { strongPassword: true };
    };
  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const urlRegex =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return urlRegex.test(control.value) ? null : { url: true };
    };
  }
}

@Component({
  selector: 'app-tag',
  templateUrl: './tag-component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFormCompoent {
  dialogRef = inject(MatDialogRef<TagFormCompoent>);
  tagForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  service = inject(PasswordService);
  snackBar = inject(MatSnackBar);

  addTag(): void {
    this.service
      .addTag(this.tagForm.value)
      .pipe(tap())
      .subscribe((res) => {
        this.snackBar.open('Tag Saved Successfully', 'close', {
          duration: 3000,
        });
        this.dialogRef.close(res);
      });
  }
}
