import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {  MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { tap, catchError } from 'rxjs';
import { NoteService } from '../../../services/note.service';
import { NotesFormComponent } from '../dialog/notes/notes-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatMenuModule, MatCheckboxModule, MatDialogModule, MatChipsModule, CommonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {

  notes: any[] = []; // Use a Subject to manage password updates
  passwordIds= [];
  changedetect = inject(ChangeDetectorRef);
  noteService = inject(NoteService);
  displayedColumns: string[] = [
    'select',
    '_id',
    'title',
    'content',
    'created_by',
    'tags',
    'favourite',
    'update_at',
    'action'
  ];
  readonly dialog = inject(MatDialog);
  isLoading: boolean = true;
  filterValue: string = ''; // Add filterValue property
  selection = new SelectionModel<any>(true, []);
  constructor() {
   this.getNotes();
  }

  getNotes(): void {
    this.isLoading = true;
    this.noteService.getNotes().subscribe((notes: any[]) => {
      this.isLoading = false;
      this.notes = notes;
      this.changedetect.detectChanges();
    }, error => {
      this.notes = [];
      this.isLoading = false;
      this.changedetect.detectChanges();
    });

  }

  delete(id: string): void {
    // Delete password using an observable
    this.noteService
      .deleteNote(id)
      .pipe(
        tap(() => {
          this.getNotes();
        }),
        catchError((error: any) => {
          console.error('err', error);
          throw error; // re-throw the error to prevent silent failures
        })
      )
      .subscribe({
        complete: () => {
          this.changedetect.detectChanges();
        },
      });
  }

  trackById(index: number, item: any): number {
    return item?._id; // assuming your Password object has an 'id' property
  }

  sharePassword(passwordId: string) {
    // this.noteService.sharePassword(passwordId)
    //   .subscribe(
    //     (response) => {

    //     },
    //     (error) => {
    //       console.error('Error generating share link:', error);
    //     }
    //   );

  }


  openPasswordFormDialog(note: any): void {
    this.dialog.open(NotesFormComponent, {
      width: '2000px',
      data: { note }
    }).afterClosed().subscribe((res) => {
      if (res) this.getNotes();
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.notes.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.notes);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id + 1}`;
  }

  updateFavourites(passwordId: string): void {
      // this.noteService.(passwordId)
      // .subscribe(
      //   (response) => {
      //     console.log('Password added to favorites successfully', response);
      //     this.getNotes();
      //     // Handle success, e.g., update UI
      //   },
      //   (error) => {
      //     console.error('Error adding password to favorites', error);
      //     // Handle error, e.g., display error message
      //   }
      // );
  }

  viewPassword(note: any): void {
    this.dialog.open(ViewNoteCompoent, {
      data: {note}
    })    
  }

}
@Component({
  selector: 'app-view-note',
  templateUrl: "./view-note.html",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule ],
})
export class ViewNoteCompoent {
  readonly data = inject<any>(MAT_DIALOG_DATA);

 
}