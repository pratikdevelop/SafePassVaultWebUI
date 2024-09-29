import { Component, inject, OnInit } from '@angular/core';
import { SecurityComponent } from './security/security.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NotificationComponent } from './notification/notification.component';
import { MfaSettingComponent } from './mfa-setting/mfa-setting.component';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SecurityComponent, PasswordChangeComponent, UserProfileComponent, MatSidenavModule, MatListModule, NotificationComponent, MfaSettingComponent, MatButtonModule
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  enableSecurityQuestions = false; // Flag for optional security questions
  tab = 0;
  mode: MatDrawerMode = 'side'
  isSidebarOpen = true;
  readonly breakpointObserver = inject(BreakpointObserver);


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
  setTab(tabNo: number): void {
    this.tab = tabNo;
    this.isSidebarOpen =false
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
