import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { MatIconModule } from '@angular/material/icon';
import { FolderService } from '../../services/folder.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateFolderDialogComponent } from '../../dialog/create-folder-dialog/create-folder-dialog.component';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * Interface representing a folder node.
 */
interface FolderNode {
  name: string;
  type: string; // Type could be 'passwords', 'notes', etc.
  children?: FolderNode[];
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, MatTreeModule, MatIconModule, CdkTreeModule, CommonModule],
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent implements OnInit {
  onExpand(_t13: any, $event: Event) {
    throw new Error('Method not implemented.');
  }

  readonly commonService = inject(CommonService);
  private readonly folderService = inject(FolderService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  urlName!: string;
  folderId: string = '';
  folders: any[] = [];
  dataSource = [
    {
      name: 'Passwords',
      type: 'passwords',
      icon: 'lock',
      redirectLink: '/dashboard/passwords',
      children: [
        {
          "_id": "671f4e671171d8be4596f363",
          "user": "67123bf62d26ff336345f17e",
          "name": "developer",
          "isSpecial": false,
          "type": "passwords",
          "createdAt": "2024-10-28T08:42:15.950Z",
          "updatedAt": "2024-10-28T08:42:15.950Z",
          "__v": 0
      }
      ],
    },
    {
      name: 'Secure Notes',
      type: 'notes',
      icon:'note',
      redirectLink: '/dashboard/notes',
      children: [
        
      ],
    },
    {
      name: 'Cards',
      type: 'card',
      icon:'credit_card',
      redirectLink: '/dashboard/cards',
      children: [],
    },
    {
      name: 'File Storgae',
      type: 'file',
      redirectLink: '/dashboard/file',
      icon: 'folder',
      chidren: [],
    },
    {
      name: 'Identity',
      type: 'identity',
      icon:'account_box',
      redirectLink: '/dashboard/identity',
      children: [],
    },
  ];

  childrenAccessor = (node: FolderNode) => node.children ?? [];

  getChildren: any;
  expansionKey: any;
  roots: any[] | DataSource<any> | Observable<any[]> | undefined;

  ngOnInit(): void {
    this.sectionOpened('passwords');
    this.urlName = this.router.url;
    this.route.paramMap.subscribe((params: any) => {
      const urls = this.urlName.split('/');
      console.log(urls[2]);

      this.folderId = params.get('folderId'); // Get folderId from the route
      if (this.folderId) {
        this.openSections[urls[2]] = true;
        console.log(`Folder ID: ${this.folderId}`);
      } else {
        // Logic for handling when no folderId is provided
        console.log('No folder ID provided, showing all passwords');
      }
    });
  }
  hasChild(_: number, node: FolderNode): boolean {
    return node.children && node.children.length > 0 || false;
  }
  openSections: { [key: string]: any } = {
    passwords: false,
    notes: false,
    cards: false,
    identity: false,
    file: false,
  };

  sectionOpened(section: string) {
    this.folderService.getFoldersByType(section).subscribe({
      next: (folders) => {
        folders = folders;
        this.dataSource.forEach((value: any) => {
          if (value.type === section) {
            value.children = folders;
          }
        });
        console.log('fd', this.dataSource);
      },
      error: (error) => {
        console.error(error);
      },
      complete:()=>{
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  filterByFolder(section: string, folderId: string | null = null) {
    console.log(this.urlName);

    if (!folderId && this.urlName !== section) {
      this.router.navigateByUrl(`/dashboard/${section}`);
    } else if (folderId !== this.folderId) {
      this.router.navigateByUrl(`/dashboard/${section}/${folderId}`);
    }
  }
  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

  openCreateFolderDialog(event: MouseEvent, type: string): void {
    event.stopPropagation(); // Prevent the event from bubbling up
    const dialogRef = this.dialog.open(CreateFolderDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.folderService.createFolder({ name: result, type }).subscribe(
          (folder) => {
            this.sectionOpened(type);
          },

          (error) => {
            console.error('Error creating folder:', error);
          }
        );
      }
    });
  }
}
