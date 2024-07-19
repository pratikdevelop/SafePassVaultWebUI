import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordFormComponent } from '../password/dialog/password-form/password-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { OrganizationComponent } from '../organization/organization.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSnackBarModule, RouterModule, MatToolbarModule, FormsModule, MatButtonModule, MatIconModule, MatMenuModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatCheckboxModule],
  templateUrl: './header.component.html',
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
      this.userProfile = user;
      console.log("rr", user);
      
      this.detectrRef.detectChanges()
    });
  }

  logout(): void {
    this.authService.logout()
      .subscribe(
        () => {
          localStorage.removeItem('token');
          this.snackbar.open('Logout successful', 'close'); // Assuming snackbar implementation
          this.router.navigateByUrl('/auth/login'); // Assuming router implementation     
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

  filterPasswords(): void {
    const filterValueLower = this.filterValue.toLowerCase().trim();
  }
  createOrganization(): void {
    this.dialog.open(OrganizationComponent, {
      height:"370px",
      width:"400px"
    }) 
  }
}