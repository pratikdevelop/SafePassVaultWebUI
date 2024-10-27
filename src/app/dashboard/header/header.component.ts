import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatSnackBarModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './header.component.html',
  styles: ` @media (min-width: 768px) {
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
`,
})
export class HeaderComponent implements OnInit {
  public readonly token = localStorage.getItem('token')?.toString();
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  userProfile: any;
  ngOnInit(): void {
    this.authService.userProfile$.subscribe({
      next: (response) => {
        this.userProfile = response;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService._userProfileSubject.next(null);
        localStorage.removeItem('token');
        this.snackbar.open('Logout successful', 'Ok', {
          duration: 2000,
        });
        this.changeDetectorRef.detectChanges();
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error('Error logging out:', error);
        this.snackbar.open(
          `Error in logout, please try sometimes later`,
          'Ok',
          {
            duration: 2000,
          }
        );
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
