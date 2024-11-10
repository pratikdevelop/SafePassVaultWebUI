import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
import { PasswordService } from '../../services/password.service';
import { AES } from 'crypto-js';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FolderService } from '../../services/folder.service';
import { TagsCreationDialogComponent } from '../../common/tags-creation-dialog/tags-creation-dialog.component';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

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
    MatSnackBarModule
  ],
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent implements OnInit {
searchFolders() {
throw new Error('Method not implemented.');
}
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
  tags: any[] = [];
  folders: any[] = [];
  selectedTags: any[] = [];

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
    this.passwordForm.patchValue(this.data.password);
    this.selectedTags = [...this.data.password?.tags];

    this.folderService.folderSubject$.subscribe((folders: any) => {
      this.folders = folders || [];
      const currentFolderId = this.passwordForm.controls['folderId'].value;
      const folder = this.folders.find((f: any) => f._id === currentFolderId);

      if (folder) {
        this.passwordForm.patchValue({
          folderId: folder._id,
          searchFolders: folder.label,
        });
      } else if (this.folders.length > 0) {
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
      this.passwordService.searchTags(searchTerm).pipe(
        map((tags: any[]) =>
          tags.map((tag: any) => ({ name: tag.name, _id: tag._id }))
        )
      ).subscribe({
        next: (tags: any[]) => {
          this.tags = tags;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error searching tags:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.tags = [];
      this.isLoading = false;
    }
  }

  onFolderSelected(event: MatAutocompleteSelectedEvent): void {
    this.passwordForm.get('folderId')?.setValue(event.option.value._id);
    this.passwordForm.get('searchFolders')?.setValue(event.option.value.label);
  }

  createNewFolder(): void {
    this.folderService.createFolder({
      name: this.passwordForm.value.searchFolders,
      type: 'passwords'
    }).subscribe({
      next: (folder: any) => {
        this.passwordForm.get('folderId')?.setValue(folder._id);
        this.passwordForm.get('searchFolders')?.setValue(folder.name);
      },
      error: (error: any) => console.error('Error creating folder:', error)
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
      this.passwordService.updatePassword(this.passwordForm.value._id, newPasswordObject).subscribe(() => {
        this.passwordForm.reset();
        this.dialogRef.close(true);
      });
    }
  }

  generateSecureKey(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  }

  createNewTag(): void {
    const dialogRef = this.dialog.open(TagsCreationDialogComponent, {
      width: '1400px'
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.passwordForm.value.tags.push(result);
          this.passwordForm.get('tags')?.setValue(this.passwordForm.value.tags);
        }
      },
      error: (error) => console.error('Error:', error)
    });
  }

  removeTag(tagId: string): void {
    const currentTags = this.passwordForm.get('tags')?.value || [];
    const updatedTags = currentTags.filter((tag: { _id: string }) => tag._id !== tagId);
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
      const urlRegex = /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return urlRegex.test(control.value) ? null : { url: true };
    };
  }
}
