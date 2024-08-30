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
  mode: MatDrawerMode = 'side';
  selectedIds!: string[];
  listingType: string = 'notes';
  filter_by!: string;
  filterValue: any;
  activateRouter = inject(Router)
  constructor() {}
  ngOnInit(): void {
    
    this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Web,
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.TabletPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.WebPortrait,
        Breakpoints.WebLandscape,
      ])
      .subscribe((result) => {
        // Iterate through the breakpoints and take action based on the matches
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.applyBreakpointAction(query);
          }
        }
      });
  }
  applyBreakpointAction(query: string): void {
    // if (
    //   query === Breakpoints.Handset ||
    //   query === Breakpoints.Tablet ||
    //   query === Breakpoints.HandsetPortrait ||
    //   query === Breakpoints.HandsetLandscape ||
    //   query === Breakpoints.TabletPortrait ||
    //   query === Breakpoints.TabletLandscape
    // ) {
    //   this.mode = 'over';
    //   this.drawer?.toggle();
    // } else if (
    //   query === Breakpoints.Web ||
    //   query === Breakpoints.WebPortrait ||
    //   query === Breakpoints.WebLandscape
    // ) {
    //   this.mode = 'side';
    //   this.drawer?.open();
    // }
  }

}
