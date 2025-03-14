import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoteService } from '../../../services/note.service';
import { FolderService } from '../../../services/folder.service';
import { catchError, debounceTime, map, Observable, switchMap } from 'rxjs';
import { TagsCreationDialogComponent } from '../../../common/tags-creation-dialog/tags-creation-dialog.component';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-notes-form',
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
  ],
  templateUrl: './notes-form.component.html',
})
export class NotesFormComponent implements OnInit {
  noteForm: FormGroup;
  private readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly dialog = inject(MatDialog);
  private readonly noteService = inject(NoteService);
  private readonly fb = inject(FormBuilder);
  private readonly folderService = inject(FolderService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly commonService = inject(CommonService);

  isLoading: any;
  folders: any[] = [];
  selectedTags: any[] = [];
  tags: any[] = [];

  constructor() {
    this.noteForm = this.fb.group({
      title: new FormControl(this.data.note?.title, Validators.required),
      content: new FormControl(this.data.note?.content, Validators.required),
      tags: new FormControl([]),
      folderId: new FormControl('', Validators.required),
      searchTerm: new FormControl(null),
      searchFolders: new FormControl(null),
    });
  }
  ngOnInit(): void {
    this.data?.note?.tags.forEach((tag: any) => {
      this.selectedTags.push([...this.selectedTags, tag]);
    });
    this.folderService.folderSubject$.subscribe((folders: any) => {
      this.folders = folders || [];
      const folder = this.folders.find((folder: any) => {
        return folder._id === this.noteForm.controls['folderId'].value;
      });

      if (folder) {
        this.noteForm.patchValue({
          folderId: folder._id,
          searchFolders: folder.label,
        });
        return;
      } else {
        this.noteForm.patchValue({
          folderId: this.folders[0]?._id,
          searchFolders: this.folders[0]?.label,
        });
      }
    });
    this.searchTags();

  }
  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    const tags = this.noteForm.value.tags || [];
    tags.push(event.option.value);

    this.noteForm.controls['tags'].setValue(tags);
    this.selectedTags = tags;

    this.noteForm.controls['searchTerm'].setValue(null);
    event.option.deselect();
    this.changeDetectorRef.detectChanges();
  }

  searchTags(): void {
    this.noteForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchTerm: string) => {
          if (searchTerm.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.commonService
              .searchTags(searchTerm.trim().toLowerCase(), 'notes')
              .pipe(
                map((tags: any[]) =>
                  tags.map((tag) => ({ name: tag.name, _id: tag._id }))
                ),
                catchError((error) => {
                  console.error('Error searching tags:', error);
                  this.isLoading = false;
                  return []; // Return an empty array in case of error
                })
              );
          } else {
            // If the search term is empty, return an empty array and stop loading
            this.isLoading = false;
            return new Observable<any[]>((observer) => {
              observer.next([]); // Emit an empty array
              observer.complete();
            });
          }
        })
      )
      .subscribe({
        next: (tags: any[]) => {
          this.tags = tags;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
        },
      });
  }
  searchFolders(): void {
    this.noteForm
      .get('searchFolders')
      ?.valueChanges.pipe(
        debounceTime(500), // Wait for 500ms after the user stops typing
        switchMap((searchFolders: string) => {
          if (searchFolders.trim()) {
            // Only make the API call if the search term is not empty
            this.isLoading = true;
            return this.folderService
              .searchFolders(searchFolders.trim().toLowerCase(), 'notes')
              .pipe(
                catchError((error) => {
                  console.error('Error searching folders:', error);
                  this.isLoading = false;
                  return []; // Return an empty array in case of error
                })
              );
          } else {
            this.isLoading = false;
            return new Observable<any[]>((observer) => {
              observer.next([]); // Emit an empty array
              observer.complete();
            });
          }
        })
      )
      .subscribe({
        next: (folders: any[]) => {
          this.folders = folders;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
        },
      });
  }

  onFolderSelected($event: MatAutocompleteSelectedEvent) {
    this.noteForm.get('folderId')?.setValue($event.option.value._id);
    this.noteForm.get('searchFolders')?.setValue($event.option.value.label);
  }
  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.noteForm.value.searchFolders,
        type: 'notes',
      })
      .subscribe({
        next: (folder: any) => {
          this.folders.push(folder)
          this.noteForm.get('folderId')?.setValue(folder._id);
          this.noteForm.get('searchFolders')?.setValue(folder.name);
          this.changeDetectorRef.detectChanges()
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }
  createNewTag(): void {
    this.dialog.open(TagsCreationDialogComponent, {
      width: '1400px',
      data: {
        name: this.noteForm.value.searchTerm,
        type: 'notes'
      }
    });
  }

  removeTag(tagId: string): void {
    // Get the current tags array

    const currentTags = this.noteForm.get('tags')?.value || [];

    // Filter out the tag by ID
    const updatedTags = currentTags.filter(
      (tag: { _id: string }) => tag._id !== tagId
    );

    // Update the tags form control with the new array
    this.noteForm.get('tags')?.setValue(updatedTags);

    // Update the selectedTags variable
    this.selectedTags = updatedTags;

    // Log the updated selectedTags for verification
  }

  onSubmit() {
    if (this.noteForm.valid) {
      if (this.data.note?._id) {
        this.noteService
          .updateNote(this.data.note._id, this.noteForm.value)
          .subscribe((response: any) => {
            this.dialogRef.close(true);
          });
      } else {
        this.noteService
          .createNote(this.noteForm.value)
          .subscribe((response: any) => {
            console.log('Note created', response);
            this.dialogRef.close(true);
          });
      }
    }
  }
}
