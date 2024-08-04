import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component, ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordComponent } from './password/password.component';
import { NotesComponent } from './notes/notes.component';
import { CardComponent } from './card/card.component';
import { IdProofComponent } from './id-proof/id-proof.component';

export interface Passwords {
  '_id': string
  'name': string
  'website': string
  'username': string
  'password': string
  'update_at': string
}


@Component({
  selector: 'app-dashbloard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    SideNavComponent,
    CommonModule,
    MatSidenavModule,
    MatFormFieldModule, MatInputModule,
    PasswordComponent,
    NotesComponent,
    CardComponent,
    IdProofComponent

  ],
  templateUrl: './dashboard.component.html',
  styles:`.responsive-element {
    width: 10% !important;
    border-radius: 0% !important;
  }

  @media screen and (max-width: 600px) {
    .responsive-element {
      width: 40% !important;
    }
  }`
})

export class DashboardComponent {
  @ViewChild('drawer') drawer: MatDrawer | undefined
   // Inject the service
  breakpointObserver = inject(BreakpointObserver);
  mode: MatDrawerMode ='side';
  selectedIds!: string[]
  listingType: string  = 'notes';
  constructor() { }
  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape
    ]).subscribe(result => {
      console.log("Breakpoint result: ", result);

      // Iterate through the breakpoints and take action based on the matches
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.applyBreakpointAction(query);
        }
      }
    });
  }
  applyBreakpointAction(query: string): void {
    if (query === Breakpoints.Handset || query === Breakpoints.Tablet || 
        query === Breakpoints.HandsetPortrait || query === Breakpoints.HandsetLandscape ||
        query === Breakpoints.TabletPortrait || query === Breakpoints.TabletLandscape) {
      this.mode = 'over';
      this.drawer?.toggle();
    } else if (query === Breakpoints.Web || query === Breakpoints.WebPortrait || query === Breakpoints.WebLandscape) {
      this.mode = 'side';
      this.drawer?.open();
    }
  }
    

 
  updateListingType(listingType: string) : void {
    this.listingType = listingType
  }



  trackById(index: number, item: any): number {
    return item?._id; // assuming your Password object has an 'id' property
  }

 
 
}


