import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FolderService } from '../../services/folder.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateFolderDialogComponent } from '../create-folder-dialog/create-folder-dialog.component';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { CommonService } from '../../services/common.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent implements OnInit {
  form = new FormGroup({
    filterList: new FormControl(''),
  });
  private readonly commonService = inject(CommonService);
  private readonly folderService = inject(FolderService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef)
  @Output() UpdateFiilterType = new EventEmitter<any>();
  isLoading = true;
  folderId: string = '';
  folders: any[] = [];
  folderType: string | undefined;
  tags: any = [];

  ngOnInit(): void {
    this.isLoading = true;
    const match = this.router.url.match(/\/dashboard\/([^\/]+)/);
    let name = match ? match[1] : '';
    this.folderType = name
    this.folderService.getFoldersByType(name).subscribe({
      next: (data: any) => {
        this.folders = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.commonService.getAllTagsByType(name).subscribe({
      next: (data: any) => {
        console.log(
          'tags',
          data
        );

        this.tags = data.tags;
      },
      error: (error) => {
        console.error(error);
      },
    })
    this.isLoading = false;
  }

  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

  openCreateFolderDialog(event: MouseEvent, type: string): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(CreateFolderDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true
        this.folderService.createFolder({ name: result, type: this.folderType }).subscribe(
          (folder) => {
            this.folders.push(folder);
            this.isLoading = false;
            this.changeDetectorRef.detectChanges()
          },
          (error) => {
            console.error('Error creating folder:', error);
            this.isLoading = false
            this.changeDetectorRef.detectChanges()
          }
        );
      }
    });
  }

  change(value: any): void {
    const type = ['favourite', 'all', 'shared_with_me', 'created_by_me'];
    if (type?.includes(value[0] || '')) {
      this.UpdateFiilterType.emit(value);
    } else {
      this.UpdateFiilterType.emit({ folderId: value });

    }
  }

  openCreateTags($event: MouseEvent, arg1: string) {
    $event.stopPropagation();

  }
}
