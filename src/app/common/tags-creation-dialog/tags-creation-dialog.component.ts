import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { PasswordService } from '../../services/password.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-tags-creation-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule
  ],
  templateUrl: './tags-creation-dialog.component.html',
  styleUrl: './tags-creation-dialog.component.css'
})
export class TagsCreationDialogComponent {
  dialogRef = inject(MatDialogRef<TagsCreationDialogComponent>);
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
