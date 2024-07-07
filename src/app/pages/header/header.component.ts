import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { PasswordFormComponent } from '../../password/dialog/password-form/password-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatSnackBarModule, RouterModule, FormsModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user:any = {};
  filterValue: string = ''; // Add filterValue property
  authService = inject(AuthService);
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  dialog = inject(MatDialog)
  detectrRef = inject(ChangeDetectorRef)
  ngOnInit(): void {
    this.getProfile()
  }

  logout(): void {
    this.authService.logout()
    .subscribe(
      () => {
        localStorage.removeItem('token');
        this.snackbar.open('Logout successful', 'close'); // Assuming snackbar implementation
        this.router.navigateByUrl('/login'); // Assuming router implementation     
      },
      error => {
        console.error('Error logging out:', error);
        this.snackbar.open('Logout failed: ' + error.message, 'close'); // Example error handling
           }
    );

  }

  getProfile(): void {
    this.authService.getProfile()
      .subscribe(
        profileData => {
          this.user = profileData
          console.log("pp", profileData);
          this.detectrRef.detectChanges();
          
        },
        error => {
          console.error('Error getting profile:', error);
          this.snackbar.open('Error retrieving profile: ' + error.message, 'close');        }
      );

  }
  openPasswordFormDialog(password:any ): void {
    this.dialog.open(PasswordFormComponent, {
      width: '1400px',
      data:{password}
    })
  }
  filterPasswords(): void {
    const filterValueLower = this.filterValue.toLowerCase().trim();
   
  }
}
