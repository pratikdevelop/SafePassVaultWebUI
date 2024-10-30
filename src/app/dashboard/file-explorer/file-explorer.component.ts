import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FileService } from '../../services/file.service'; // Import your file service here
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from '../../dialog/file-upload/file-upload.component';
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
import { HeaderComponent } from "../../common/header/header.component";
import { SideNavComponent } from "../side-nav/side-nav.component";

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
    MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    HeaderComponent,
    SideNavComponent,
    MatSidenavModule
]
})
export class FileExplorerComponent implements OnInit {
onShareItem(arg0: any) {
throw new Error('Method not implemented.');
}
onPreviewFile(arg0: any) {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['filename', 'size','uploadedAt',  'actions'];
  dataSource!: any[]
  private fileService = inject(FileService);
  private changeDetectorRef = inject(ChangeDetectorRef)
  readonly commonService = inject(CommonService) 
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  readonly dialog = inject(MatDialog);
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly router = inject(Router);
  readonly activateRouter = inject(ActivatedRoute)
  readonly service  = inject(FolderService);
  mode: MatDrawerMode = 'side';
  folders: any[] = [];
  isSidebarOpen: boolean = true;
  isBreakPoint: boolean = false;
  isShow: boolean = false;

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

  loadFiles(): void {
    this.fileService.getFilesAndFolders('').subscribe(files => {
      this.dataSource = files;
      this.changeDetectorRef.detectChanges();
    });
  }

  openFileDialog(): void {
    this.dialog.open(FileUploadComponent, {
      width:'600px'
    })
  }

  setFilter(fileId: string): void {
    // Implement preview functionality
  }

  performAction(fileId: string): void {
    // Implement share functionality
  }
  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

}