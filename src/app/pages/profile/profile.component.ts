import { Component, OnInit } from '@angular/core';
import { SecurityComponent } from './security/security.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SecurityComponent, PasswordChangeComponent, UserProfileComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  enableSecurityQuestions = false; // Flag for optional security questions
  tab = 0;

  ngOnInit(): void {}
  setTab(tabNo: number): void {
    this.tab = tabNo;
  }
}
