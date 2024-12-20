import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordService } from '../../../services/password.service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-view-password',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, FormsModule,CommonModule, MatExpansionModule],
  templateUrl: './view-password.component.html',
  styleUrl: './view-password.component.css'
})
export class ViewPasswordComponent implements OnChanges {
  @Input() password!: any ;
  newComment: string = '';
  newTag: string = '';
  readonly passwordService = inject(PasswordService)
  detectorRef = inject(ChangeDetectorRef)
  viewPassword: any;

  @Output() commentAdded = new EventEmitter<any>();
  @Output() tagAdded = new EventEmitter<string>();

    
  ngOnChanges(changes: SimpleChanges): void {
    console.log('dd',this.password);
    this.viewPassword = this.password;
    this.detectorRef.detectChanges()
  }

  addComment() {
    if (this.newComment.trim()) {
      const newComment: any = {
        text: this.newComment,
        createdAt: new Date().toISOString(),
        userId: 'John Doe',
      };
      this.passwordService.postComment(this.password._id, this.newComment)
      .subscribe(
        response => {
          console.log('Comment added successfully', response);
          if (!this.password.comments) {
            this.password.comments = [];
          } 
          this.password.comments.push(response.comment);
          // Handle successful response (e.g., update UI)
          this.commentAdded.emit(response.comment);
          this.newComment = '';
        this.detectorRef.detectChanges();
        },
        error => {
          console.error('Error adding comment', error);
          // Handle error response
        }
      );
  }
  }

  addTag() {
    if (this.newTag.trim()) {
      // Initialize tags array if it's null
      if (!this.password.tags) {
        this.password.tags = [];
      }
    
      // Add new tag to the array
      this.passwordService.addTagToPassword(this.password._id, this.newTag).subscribe((ressponse: any)=>{
        console.log('rr', ressponse);
        this.password.tags.push(ressponse.tag);
        this.tagAdded.emit(ressponse.tag);
        this.newTag = '';
        this.detectorRef.detectChanges();
      })
    }
    
  }

  removeTag(tag: string) {
    if (this.password?.tags) {
      this.password.tags = this.password.tags.filter((t: string) => t !== tag);
    }
  }

}
