import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProofIdService } from '../../services/proof-id.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdproofformComponent } from './idproofform/idproofform.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
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
import { SideNavComponent } from "../../common/side-nav/side-nav.component";
import { Identity } from '../../interfaces/identity';

@Component({
  selector: 'app-id-proof',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule, HeaderComponent, SideNavComponent, MatSidenavModule],
  templateUrl: './id-proof.component.html',
  styleUrl: './id-proof.component.css'
})

export class IdProofComponent implements OnInit {
  togglefavourites(arg0: string) {
    throw new Error('Method not implemented.');
  }
  deleteIdentity(arg0: null) {
    throw new Error('Method not implemented.');
  }
  viewIdentity(arg0: any) {
    throw new Error('Method not implemented.');
  }
  onShareItem(arg0: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly commonService = inject(CommonService);
  readonly router = inject(Router);
  readonly activateRouter = inject(ActivatedRoute);
  readonly service = inject(FolderService);
  readonly idProofService = inject(ProofIdService);
  readonly changeDetetorRef = inject(ChangeDetectorRef);
  readonly dialog = inject(MatDialog);
  mode: MatDrawerMode = 'side';
  folders: any[] = [];
  isSidebarOpen: boolean = true;
  isBreakPoint: boolean = false;
  isShow: boolean = false;
  displayedColumns: string[] = [
    'idType',
    'idNumber',
    'issuedBy',
    'issueDate',
    'expiryDate',
    'createdAt',    // Add this column
    'createdBy',    // Add this column
    'actions'
  ];
  dataSource: Identity[] = [];

  constructor() {
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
  ngOnInit(): void {
    this.idProofService.getProofIds().subscribe({
      next: (response: any) => {
        this.dataSource = response.proofIds;
        this.changeDetetorRef.detectChanges()
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  openIdProofFormDialog(proof: any) {
    const dialogRef = this.dialog.open(IdproofformComponent, {
      width: '500px',
      data: { proof: proof }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }
  performAction(arg0: string) {
    throw new Error('Method not implemented.');
  }




  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

}