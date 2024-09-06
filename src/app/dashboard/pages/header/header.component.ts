import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordFormComponent } from '../dialog/password-form/password-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { OrganizationComponent } from '../../../admiin/dialog/organization/organization.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSnackBarModule, RouterModule, FormsModule, MatButtonModule, CommonModule, MatIconModule, MatMenuModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './header.component.html',
  styles:` @media (min-width: 768px) {
    .menu-button {
      display: none;
    }
  }

  /* Hide complete menu on smaller screens */
  @media (max-width: 767px) {
    .menu-content {
      display: none;
    }
  }

  /* Show complete menu on larger screens */
  @media (min-width: 768px) {
    .menu-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    .menu-item {
      margin: 5px 0;
    }
  }
`
})
export class HeaderComponent implements OnInit {
  token = localStorage.getItem('token')?.toString();
  filterValue: string = ''; // Add filterValue property
  authService = inject(AuthService);
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  dialog = inject(MatDialog)
  detectrRef = inject(ChangeDetectorRef)
  selectedTags: string = 'default';
  filter_by: string = "";
  action: string = ''
  userProfile: any;
  ngOnInit(): void {
    this.authService.userProfile$.subscribe(user => {
      console.log('user', user);
      
      this.userProfile = user?.user;      
      this.detectrRef.detectChanges()
    });
  }

  logout(): void {
    this.authService.logout()
      .subscribe(
        () => {
          localStorage.removeItem('token');
          this.snackbar.open('Logout successful', 'close');
          this.router.navigateByUrl('/'); 
        },
        error => {
          console.error('Error logging out:', error);
          this.snackbar.open('Logout failed: ' + error.message, 'close'); // Example error handling
        }
      );
  }

  openPasswordFormDialog(): void {
    this.dialog.open(PasswordFormComponent, {
      minWidth: '85%'
    })
  }
  performAction(vlaue: string): void {
    this.action = vlaue
    console.log("event", this.action);

  }
  setFilter(type: string): void {
    this.filter_by = type;
  }


  createOrganization(): void {
    this.dialog.open(OrganizationComponent, {
      height:"370px",
      width:"400px"
    }) 
  }
}