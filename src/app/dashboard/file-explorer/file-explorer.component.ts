import { ChangeDetectorRef, Component, OnInit, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FileService } from '../../services/file.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CommonService } from '../../services/common.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { HeaderComponent } from "../../common/header/header.component";
import { SideNavComponent } from "../../common/side-nav/side-nav.component";
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilePreview } from '../../interfaces/file';
import { FilePreviewComponent } from './file-preview/file-preview.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css'],
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    HeaderComponent,
    SideNavComponent,
    MatSidenavModule,
    MatCheckboxModule,
    FilePreviewComponent,
    MatSnackBarModule
  ]
})
export class FileExplorerComponent implements OnInit {

  displayedColumns: string[] = ['select', 'favourites', 'id', 'filename', 'uploaded_by', 'size', 'uploadedAt', 'actions'];
  dataSource!: any[];
  selection = new SelectionModel<any>(true, []);
  private fileService = inject(FileService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly commonService = inject(CommonService);
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly activateRouter = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  mode: MatDrawerMode = 'side';
  folders: any[] = [];
  isSidebarOpen: boolean = true;
  isBreakPoint: boolean = false;
  isShow: boolean = false;
  isFilePreviewOpen: boolean = false;
  file!: FilePreview;
  fileDownloadUrl: string = ''; // Holds the download URL

  ngOnInit(): void {
    this.loadFiles();
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
      console.log('resolver data', response);
    });

    this.commonService.sideBarOpen.subscribe((res) => {
      if (this.isBreakPoint) {
        this.isSidebarOpen = res;
      }
    });

    if (this.router.url.includes('profile')) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }
  }

  loadFiles(): void {
    this.fileService.getFilesAndFolders('').subscribe((files: any[]) => {
      this.dataSource = files;
      this.changeDetectorRef.detectChanges();
    });
  }

  openFileDialog(): void {
    this.dialog.open(FileUploadComponent, {
      width: '600px'
    });
  }

  updateFavourites(cardId?: string): void {
    // Handle add to favourites logic here
  }

  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id + 1}`;
  }

  onShareItem(arg0: any): void {
    // Implement share functionality
  }

  // Method to open file preview
  onPreviewFile(fileId: string): void {
    this.fileService.getFilePreview(fileId).pipe().subscribe({
      next: (response: any) => {
        console.log(response);
        this.file = response;
        this.isFilePreviewOpen = true;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  downloadFile(fileId: string): void {
    this.fileService.getFilePreview(fileId).subscribe({
      next: (response: any) => {
        const fileDownloadUrl = response.location; // Assuming location is the file's download URL
        const link = document.createElement('a');
        link.href = fileDownloadUrl;
        link.download = response.originalName || 'file'; // Set a default filename if none is provided
        link.target = '_blank'; // Optional: Opens the link in a new tab if direct download fails
        link.click();
  
        // Optionally, clean up created DOM element
        link.remove();
      },
      error: (error: any) => {
        console.error('Error during file download:', error);
      }
    });
  }
  

  onEditFile(fileId: string): void {
    const file = this.dataSource.find(f => f._id === fileId);

    if (file) {
      const dialogRef = this.dialog.open(FileUploadComponent, {
        width: '500px',
        data: file, // Pass file data to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadFiles(); // Reload files after update
        }
      });
    }
  }

  deleteFile(fileId: string): void {
    this.fileService.deleteFile(fileId).pipe().subscribe({
      next: () => {
        this.loadFiles(); // Reload files after deletion
        this.snackBar.open('File Data Deleted Successfully', 'Ok', {
          duration: 3000,
          direction: "rtl"
        })
      },
      error: () => {
        console.log('Error deleting file');
        this.snackBar.open(`Error deleting the file data`, `Ok`, {
          duration: 3000,
          direction: 'ltr'
        })

      }
    })
  }

  // Action method (e.g., sharing file)
  performAction(fileId: string): void {
    // Implement share functionality
  }

  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }
}
