import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav/side-nav.component';
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
import { HeaderComponent } from '../common/header/header.component';

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
    MatDialogModule,HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @ViewChild('drawer') drawer: MatDrawer | undefined;
  readonly dialog = inject(MatDialog);
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly commonService = inject(CommonService);
  readonly activateRouter = inject(Router);
  mode: MatDrawerMode = 'side';
  isSidebarOpen: boolean = true;
  isBreakPoint: boolean = false;
  constructor() {}
  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((result) => {
        // Iterate through the breakpoints and take action based on the matches
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
  }
}
