import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProofIdService } from '../../services/proof-id.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdproofformComponent } from './idproofform/idproofform.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewChild } from '@angular/core';
import {
  MatDrawer,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../common/header/header.component';
import { SideNavComponent } from '../../common/side-nav/side-nav.component';
import { Identity } from '../../interfaces/identity';

@Component({
  selector: 'app-id-proof',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    HeaderComponent,
    SideNavComponent,
    MatSidenavModule,
  ],
  templateUrl: './id-proof.component.html',
  styleUrl: './id-proof.component.css',
})
export class IdProofComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly commonService = inject(CommonService);
  private readonly router = inject(Router);
  private readonly idProofService = inject(ProofIdService);
  private readonly changeDetetorRef = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
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
    'createdAt', // Add this column
    'createdBy', // Add this column
    'actions',
  ];
  idProofs: Identity[] = [];

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
        this.changeDetetorRef.detectChanges();

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
    this.getIdentities();
  }
  getIdentities(): void {
    this.idProofService.getProofIds().subscribe({
      next: (data: any) => {
        this.idProofs = data.proofIds;
        console.log(data.proofIds);
        this.changeDetetorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  openIdProofFormDialog(proof: any) {
    const dialogRef = this.dialog.open(IdproofformComponent, {
      width: '500px',
      data: { proof: proof },
    });
    dialogRef.afterClosed().subscribe((result) => {
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
