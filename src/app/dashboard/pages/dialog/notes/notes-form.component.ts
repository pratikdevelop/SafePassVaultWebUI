import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PasswordService } from '../../../../services/password.service';
import { NoteService } from '../../../../services/note.service';

@Component({
  selector: 'app-notes-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatToolbarModule, MatFormFieldModule, CommonModule, MatInputModule, MatAutocompleteModule, MatDialogModule, MatCheckboxModule, MatChipsModule, MatIconModule],
  templateUrl: './notes-form.component.html',
})
export class NotesFormComponent {
  noteForm: FormGroup;
  readonly data = inject<any>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);


  constructor(private fb: FormBuilder, private noteService: NoteService) {
    console.log("noe::", this.data.note);
    
    this.noteForm = this.fb.group({
      title: [this.data.note?.title, Validators.required],
      content: [this.data.note?.content, Validators.required]
    });
  }

  onSubmit() {
    if (this.noteForm.valid) {
      if (this.data.note?._id) {
        this.noteService.updateNote(this.data.note._id, this.noteForm.value).subscribe((response:any)=>{
          this.dialogRef.close(true)
        })
      } else {
        this.noteService.createNote(this.noteForm.value).subscribe((response: any) => {
          console.log('Note created', response);
          this.dialogRef.close(true)
        });

      }
    }
  }
}
