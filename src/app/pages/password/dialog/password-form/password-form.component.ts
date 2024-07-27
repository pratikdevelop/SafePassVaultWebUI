import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, computed, inject, model, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordService } from '../../../../services/password.service';
import { AES } from 'crypto-js';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { auditTime, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, CommonModule, MatInputModule, MatAutocompleteModule, MatDialogModule, MatCheckboxModule, MatChipsModule, MatIconModule],
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent implements OnInit {
  isLoading: boolean = false;
  passwordForm = new FormGroup({
    _id: new FormControl(),
    name: new FormControl(''),
    description: new FormControl(''),
    website: new FormControl('', [Validators.required, this.urlValidator()]), // Added URL validation
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, this.strongPasswordValidator()]), // Added strong password validation
    tags: new FormControl()
  });
  searchTerm = model('');
  dialog = inject(MatDialog)
  formbuilder = inject(FormBuilder);
  passwordService = inject(PasswordService)
  readonly data = inject<any>(MAT_DIALOG_DATA);
  detectorRef = inject(ChangeDetectorRef)
  readonly dialogRef = inject(MatDialogRef<PasswordFormComponent>);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly tagsName = signal(['']);
  tags: any[] = []

  ngOnInit(): void {
    this.passwordForm.patchValue(this.data.password)
    const tagIds: any[] = [];
    this.data.password.tags.forEach((tag: any) => {
      this.tagsName.update(tagNam => [...tagNam, tag.name])
      tagIds.push(tag._id)
    });
    this.passwordForm.get('tags')?.setValue(tagIds);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tags = this.passwordForm.value.tags
    this.passwordForm.controls.tags.setValue([...tags, event.option.value._id])
    this.tagsName.update(tagname => [...tagname, event.option.viewValue])
    this.searchTerm.set('');
    event.option.deselect();
    this.detectorRef.detectChanges();
  }

  searchTags(): void {
    if (this.searchTerm.toString().length > 0) {
      this.isLoading = true
      this.passwordService.searchTags(this.searchTerm.toString()).subscribe((res) => {
        this.tags = res;
        this.isLoading = false;
        this.detectorRef.detectChanges();
      }, (error) => {
        this.tags = [];
        console.error("Error fetching the Tags, Error: ", error);
      });
    }
  }

  addPassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }
    const fixedKey =  this.passwordForm?.value._id? this.data?.password.key :this.generateSecureKey(32);
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
      description: this.passwordForm.value.description
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
      width: '1400px'
    });
  }

  remove(fruit: string): void {
    // this.fruits.update(fruits => {
    //   const index = fruits.indexOf(fruit);
    //   if (index < 0) {
    //     return fruits;
    //   }

    //   fruits.splice(index, 1);
    //   this.announcer.announce(`Removed ${fruit}`);
    //   return [...fruits];
    // });
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
      const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      return urlRegex.test(control.value) ? null : { url: true };
    };
  }
}

@Component({
  selector: 'app-tag',
  templateUrl: "./tag-component.html",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFormCompoent {
  dialogRef = inject(MatDialogRef<TagFormCompoent>)
  tagForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  })
  service = inject(PasswordService)
  snackBar = inject(MatSnackBar)

  addTag(): void {
    this.service.addTag(this.tagForm.value).pipe(tap()).subscribe((res) => {
      this.snackBar.open('Tag Saved Successfully', 'close', {
        duration: 3000
      })
      this.dialogRef.close(res);
    })
  }
}