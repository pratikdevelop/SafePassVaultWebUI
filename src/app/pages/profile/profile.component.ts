import { Component, OnInit } from '@angular/core';
import { SecurityComponent } from './security/security.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NotificationComponent } from './notification/notification.component';
import { MfaSettingComponent } from './mfa-setting/mfa-setting.component';
import { MatButtonModule } from '@angular/material/button';
import { RolesPermissionsComponent } from '../admiin/roles-permissions/roles-permissions.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SecurityComponent, PasswordChangeComponent, UserProfileComponent, MatSidenavModule, MatListModule, NotificationComponent, MfaSettingComponent, MatButtonModule, RolesPermissionsComponent
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  enableSecurityQuestions = false; // Flag for optional security questions
  tab = 0;
  isSidebarOpen = true;


  ngOnInit(): void {}
  setTab(tabNo: number): void {
    this.tab = tabNo;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
