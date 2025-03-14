import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-note-view',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatCardModule, MatDialogModule, MatToolbarModule, MatChipsModule, MatIconModule, MatExpansionModule],
  templateUrl: './note-view.component.html',
  styleUrl: './note-view.component.css'
})
export class NoteViewComponent implements OnInit {
readonly data = inject<any>(MAT_DIALOG_DATA);
  public note: any = null;
     newTag: string = '';
  newCommentText: string = '';
  ngOnInit(): void {
    this.note = this.data.note
    console.log('ddd', this.data , 'note::', this.note);
  }
  


  // Method to add a new tag
  addTag() {
    if (this.newTag.trim()) {
      this.note.tags.push({ name: this.newTag.trim() });
      this.newTag = ''; // Reset the input field after adding
    }
  }

  // Method to add a new comment
  addComment() {
    if (this.newCommentText.trim()) {
      const newComment = {
        text: this.newCommentText.trim(),
        createdAt: new Date(),
        user: { name: 'test user' }, // In a real app, this would be dynamically set
      };
      this.note.comments.push(newComment);
      this.newCommentText = ''; // Reset the textarea after adding
    }
  }

  removeTag(tag: any) {

  }
}
