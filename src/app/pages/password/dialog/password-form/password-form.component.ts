import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordService } from '../../../../services/password.service';
import { AES } from 'crypto-js';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { auditTime, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, CommonModule, MatInputModule, MatAutocompleteModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './password-form.component.html',
})
export class PasswordFormComponent implements OnInit {
  passwordForm!: FormGroup;
  tags: any[] = [];
  dialog = inject(MatDialog)
  formbuilder = inject(FormBuilder);
  passwordService = inject(PasswordService)
  readonly data = inject<any>(MAT_DIALOG_DATA);
  detectorRef = inject(ChangeDetectorRef)
  readonly dialogRef = inject(MatDialogRef<PasswordFormComponent>);


  ngOnInit(): void {
    this.passwordForm = this.formbuilder.group({
      _id: [this.data?.password?._id ?? ""],
      name: [""],
      description: [""],
      website: [this.data?.password?.website ?? '', Validators.required],
      username: [this.data?.password?.username ?? '', Validators.required],
      password: [this.data?.password?.password ?? '', Validators.required],
      searchTerm: ['']
    });


    this.passwordForm.get("searchTerm")?.valueChanges.pipe(
      auditTime(1000),
      map((event: any) => {
        return event;
      }),
      debounceTime(1000),
      distinctUntilChanged()).subscribe((searchTerm) => {
        this.passwordService.searchTags(searchTerm).subscribe((res) => {
          this.tags = res;  
          this.detectorRef.detectChanges();
          
        }, (error) => {
          this.tags = [];
          console.error("Error fetching the Tags, Error: ", error);
        });
      })
  }


  searchTags(): void { }

  addPassword(): void {
    if(this.passwordForm.invalid) {
      return;
    }
    const fixedKey = this.generateSecureKey(32);
    const encryptedPassword = AES.encrypt(
      this.passwordForm?.value?.password,
      fixedKey
    );
    // Create the new password object  
    const newPasswordObject = {
      website: this.passwordForm?.get('website')?.value,
      username: this.passwordForm?.get('username')?.value,
      password: encryptedPassword.toString(),
      key: this.passwordForm?.value._id ? this.data?.password.key : fixedKey,
      name: this.passwordForm.value.name,
      tags:[this.passwordForm.value.searchTerm],
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
    dialogRef.afterClosed().subscribe((res)=>{
      
    }
    )
    
  }
}

@Component({
  selector: 'app-tag',
  templateUrl: "./tag-component.html",
  standalone: true,
  imports: [MatButtonModule,MatDialogModule, MatSnackBarModule, ReactiveFormsModule, MatFormFieldModule,MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFormCompoent {
  dialogRef = inject(MatDialogRef<TagFormCompoent>)
  tagForm =  new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  })
  service = inject(PasswordService)
  snackBar=inject(MatSnackBar)

  addTag():void {
    this.service.addTag(this.tagForm.value).pipe(tap()).subscribe((res)=>{
      this.snackBar.open('Tag Saved Successfully', 'close', {
        duration:3000
      })
      this.dialogRef.close(res);
    })
  }
}
