import { Component, inject, OnInit } from '@angular/core';
import { SecurityComponent } from './security/security.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ MatSidenavModule, MatListModule, MatButtonModule, RouterModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  enableSecurityQuestions = false; // Flag for optional security questions
  tab = 0;
  mode: MatDrawerMode = 'side'
  isSidebarOpen = true;
  readonly breakpointObserver = inject(BreakpointObserver);
  readonly router = inject(Router) 
  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      if (result.breakpoints['(max-width: 600px)']) {
        this.isSidebarOpen = false;
        this.mode='over'
        } else {
          this.isSidebarOpen = true;
        this.mode='side'

          }
    });

  }
  setTab(url: string): void {
    this.router.navigateByUrl(`/profile/${url}`)
    this.toggleSidebar();
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
