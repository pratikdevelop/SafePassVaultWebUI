import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { tap, catchError } from 'rxjs';
import { NoteService } from '../../services/note.service';
import { NotesFormComponent } from './notes/notes-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewChild } from '@angular/core';
import {
  MatDrawer,
  MatDrawerMode,
  MatSidenavModule
} from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { HeaderComponent } from '../../common/header/header.component';
import { SideNavComponent } from "../../common/side-nav/side-nav.component";
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoteViewComponent } from './note-view/note-view.component';
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDialogModule,
    MatChipsModule,
    CommonModule,
    MatSidenavModule,
    HeaderComponent,
    SideNavComponent
],
  templateUrl: './notes.component.html',
})
export class NotesComponent implements OnInit {
  notes: any[] = []; // Use a Subject to manage password updates
  readonly passwordIds = [];
  readonly changedetect = inject(ChangeDetectorRef);
  readonly noteService = inject(NoteService);
  readonly commonService = inject(CommonService);
  readonly displayedColumns: string[] = [
    'select',
    '_id',
    'title',
    'content',
    'created_by',
    // 'tags',
    'favourite',
    'update_at',
    'action',
  ];
  readonly dialog = inject(MatDialog);
  isLoading: boolean = true;
  selection = new SelectionModel<any>(true, []);
  searchTerm: string = '';
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly router = inject(Router);
  readonly activateRouter = inject(ActivatedRoute)
  readonly service  = inject(FolderService);
  mode: MatDrawerMode = 'side';
  folders: any[] = [];
  isSidebarOpen: boolean = true;
  isBreakPoint: boolean = false;
  isShow: boolean = false;
  folderId!: string;
  ngOnInit(): void {
    this.getNotes();
  }
  getNotes(event: any = ['all']): void {
    if (event?.folderId) {
      this.folderId = event.folderId;
    }

    this.isLoading = true;
    this.noteService.getNotes(this.searchTerm, event).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.notes = response.data;
        this.changedetect.detectChanges();
      },
      (error) => {
        this.notes = [];
        this.isLoading = false;
        this.changedetect.detectChanges();
      }
    );

    this.breakpointObserver
    .observe(['(max-width: 600px)'])
    .subscribe((result) => {
      if (result.breakpoints['(max-width: 600px)']) {
        this.isBreakPoint = true;
        this.isSidebarOpen = false;
        this.mode = 'over';
      } else {
        this.isSidebarOpen = true;
        this.isBreakPoint = false;
        this.mode = 'side';
      }
    });
    
    this.activateRouter.data.subscribe((response: any) => {
      console.log('resolver data',  response);
      
    })
  this.commonService.sideBarOpen.subscribe((res) => {
    if (this.isBreakPoint) {
      this.isSidebarOpen = res;
    }
  });
  if(this.router.url.includes('profile')) {
    this.isShow = false;
  }else {
    this.isShow = true;
  }
  }

  deleteNotes(id?: string): void {
    const ids =
      id ??
      this.selection.selected
        .map((note) => {
          return note._id;
        })
        .join(',');
    // Delete password using an observable
    this.noteService
      .deleteNote(ids)
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

  updateFavourites(noteId?: string): void {
    const ids =
      noteId ??
      this.selection.selected
        .map((pass) => {
          return pass._id;
        })
        .join(',');
    this.noteService.addToFavorites(ids).subscribe(
      (response) => {
        console.log('Password added to favorites successfully', response);
        this.getNotes();
        // Handle success, e.g., update UI
      },
      (error) => {
        console.error('Error adding password to favorites', error);
        // Handle error, e.g., display error message
      }
    );
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row._id + 1
    }`;
  }

  viewNotee(note: any): void {
    this.dialog.open(NoteViewComponent, {
      width:"500px",
      height:"600px",
      data: { note },
    });
  }
  openNotesDialog(note: any): void {
    const dialogRef = this.dialog.open(NotesFormComponent, {
      data: { note },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.getNotes();
      }
    });
  }
  exportPassword(): void {
    const ids = this.selection.selected
      .map((pass) => {
        return pass._id;
      })
      .join(',');
    this.noteService.exportNotesAsCsv(ids).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passwords.csv';
      a.click();
    });
  }

  toggleSideBar(): void {
    this.commonService.toggleSideBar()
  }
}
