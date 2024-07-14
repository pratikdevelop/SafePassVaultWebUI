import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSnackBarModule, RouterModule, FormsModule, MatButtonModule],
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
  ngOnInit(): void {
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


}
