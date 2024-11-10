import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-create-folder-dialog',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule, MatIconModule, MatButtonModule,MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule,CommonModule ],
  templateUrl: './create-folder-dialog.component.html',
  styleUrl: './create-folder-dialog.component.css'
})
export class CreateFolderDialogComponent {
  folderName: string = '';

  constructor(public dialogRef: MatDialogRef<CreateFolderDialogComponent>) {}

  onCreate() {
    // Handle the folder creation logic here
    this.dialogRef.close(this.folderName); // Close the dialog and pass back the folder name
  }

  onCancel() {
    this.dialogRef.close(); // Just close the dialog without any action
  }

  onClose() {
    this.dialogRef.close(); // Close the dialog when clicking the close button
  }
}
