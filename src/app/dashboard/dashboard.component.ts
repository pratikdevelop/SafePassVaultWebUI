import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from '../component/side-nav/side-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDrawer,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-dashbloard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    SideNavComponent,
    RouterModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  dialog = inject(MatDialog)
  breakpointObserver = inject(BreakpointObserver);
  readonly commonService = inject(CommonService)
  mode: MatDrawerMode = 'side';
  selectedIds!: string[];
  listingType: string = 'notes';
  filter_by!: string;
  filterValue: any;
  activateRouter = inject(Router)
  isSidebarOpen: boolean = true;
  constructor() {}
  ngOnInit(): void {
    
    this.breakpointObserver
      .observe([
        '(max-width: 600px)'
      ])
      .subscribe((result) => {
        // Iterate through the breakpoints and take action based on the matches
          if (result.breakpoints['(max-width: 600px)']) {
            this.isSidebarOpen = false;
            this.mode='over'
            } else {
              this.isSidebarOpen = true;
            this.mode='side'
    
              }
              });
    
    this.commonService.sideBarOpen.subscribe((res)=>{
      this.isSidebarOpen = res;
    })
  
  }

}
