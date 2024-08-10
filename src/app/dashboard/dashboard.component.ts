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
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationComponent } from './pages/organization/organization.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreditCardFormComponent } from './pages/dialog/credit-card-form/credit-card-form.component';
import { IdproofformComponent } from './pages/dialog/idproofform/idproofform.component';
import { NotesFormComponent } from './pages/dialog/notes/notes-form.component';
import { PasswordFormComponent } from './pages/dialog/password-form/password-form.component';

export interface Passwords {
  _id: string;
  name: string;
  website: string;
  username: string;
  password: string;
  update_at: string;
}

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
  styles: `.responsive-element {
    width: 10% !important;
    border-radius: 0% !important;
  }

  @media screen and (max-width: 600px) {
    .responsive-element {
      width: 40% !important;
    }
  }`,
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
        console.log('Breakpoint result: ', result);

        // Iterate through the breakpoints and take action based on the matches
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.applyBreakpointAction(query);
          }
        }
      });
  }
  applyBreakpointAction(query: string): void {
    if (
      query === Breakpoints.Handset ||
      query === Breakpoints.Tablet ||
      query === Breakpoints.HandsetPortrait ||
      query === Breakpoints.HandsetLandscape ||
      query === Breakpoints.TabletPortrait ||
      query === Breakpoints.TabletLandscape
    ) {
      this.mode = 'over';
      this.drawer?.toggle();
    } else if (
      query === Breakpoints.Web ||
      query === Breakpoints.WebPortrait ||
      query === Breakpoints.WebLandscape
    ) {
      this.mode = 'side';
      this.drawer?.open();
    }
  }

  updateListingType(listingType: string): void {
    this.listingType = listingType;
  }

  trackById(index: number, item: any): number {
    return item?._id; // assuming your Password object has an 'id' property
  }

  performAction(vlaue: string): void {
    switch (vlaue) {
      case 'delete':
        // this.passwordService
        //   ?.deleteMultiplePasswords(this.passwordIds ?? [''])
        //   .subscribe((response) => {
        //     this.snackbar.open('Password deleted Successfully', 'close', {
        //       duration: 2000,
        //     });
        //   });
    }
  }
  setFilter(type: string): void {
    this.filter_by = type;
  }

  filterPasswords(): void {
    const filterValueLower = this.filterValue.toLowerCase().trim();
  }

  createOrganization(): void {
    this.dialog.open(OrganizationComponent);
  }

  setListingType(listingType: string): void {}

  openAddNoteForm(): void {
    const dialog = this.dialog.open(NotesFormComponent, {
      width: '1400px',
    });
    dialog.afterClosed().subscribe((response) => {
      if (response) {
      }
    });
  }
  openIdProofForm(): void {
    const dialog = this.dialog.open(IdproofformComponent, {
      width: '1400px',
    });
    dialog.afterClosed().subscribe((response) => {
      if (response) {
      }
    });
  }
  opencardAddForm(): void {
    const dialog = this.dialog.open(CreditCardFormComponent, {
      width: '1400px',
    });
    dialog.afterClosed().subscribe((response) => {
      if (response) {
      }
    });
  }

  openPasswordFormDialog(): void {
    this.dialog
      .open(PasswordFormComponent, {
        width: '2000px',
      })
      .afterClosed()
      .subscribe((res) => {
      });
  }
}
