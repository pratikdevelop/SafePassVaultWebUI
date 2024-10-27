import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { FolderService } from '../../services/folder.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateFolderDialogComponent } from '../../dialog/create-folder-dialog/create-folder-dialog.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './side-nav.component.html',
  styles: `
    .mat-expansion-panel  {
    display: block !important;
    border-radius: 0 !important;
    box-shadow:none !important;
}
  `,
})
export class SideNavComponent implements OnInit {
  
  readonly commonService = inject(CommonService);
  private readonly folderService = inject(FolderService);
  private readonly dialog = inject(MatDialog)
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute)
  folderId!: string;
  folders: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.folderId = params.get('folderId');  // Get folderId from the route
      if (this.folderId) {
        // Logic for handling specific folder
        console.log(`Folder ID: ${this.folderId}`);
      } else {
        // Logic for handling when no folderId is provided
        console.log('No folder ID provided, showing all passwords');
      }
    });
  }
  openSections: { [key: string]: any } = {
    passwords: true,
    notes: false,
    cards: false,
    identity: false,
    file: false,
  };

  sectionOpened(section: string) {
    this.openSections[section] = true;
    this.folderService.getFoldersByType(section).subscribe({
      next: (folders) => {
        this.folders = folders;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  sectionClosed(section: string) {
    this.openSections[section] = false;
  }

  isSectionOpen(section: string): boolean {
    return this.openSections[section];
  }

  filterByFolder(section: string, folderId: string) {
    console.log(`Filtering ${section} by folder ID: ${folderId}`);
    // Implement your filtering logic here based on the section and selected folder
    this.router.navigateByUrl(`/dashboard/${section}/${folderId}`)
  }
  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

  openCreateFolderDialog(event: MouseEvent, type: string): void {
    event.stopPropagation(); // Prevent the event from bubbling up
    const dialogRef = this.dialog.open(CreateFolderDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.folderService.createFolder({ name: result, type }).subscribe(
          (folder) => {
            // Handle successful folder creation (e.g., refresh the folder list)
          },
          (error) => {
            console.error('Error creating folder:', error);
          }
        );
      }
    });
  }
  
}
