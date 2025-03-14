import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
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
  styles:`
  /* Custom Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Mobile Menu Animation */
.lg\:hidden {
  transition: all 0.3s ease;
}

/* Hover Effects */
.hover\:text-blue-400:hover {
  color: #60a5fa;
}

/* Ensure the mobile menu takes full width */
.bg-gray-800 {
  width: 100%;
}`
})
export class HeaderComponent implements OnInit {
  token: string | null | undefined = localStorage.getItem('token')?.toString();
  @Output() updateSideBarFF = new EventEmitter<string>()

  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  isLoading: boolean = true;
  userProfile: any;

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.userProfile$.subscribe({
      next: (response) => {
        this.userProfile = response;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }


  isMobileMenuOpen = false; // Tracks mobile menu state
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.userProfile = null;
        this.token = null;
        localStorage.removeItem('token')

        this.authService._userProfileSubject.next(null);
        localStorage.removeItem('token');
        this.snackbar.open('Logout successful', 'Ok', {
          duration: 2000,
        });
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();


      },
      error: (error) => {
        localStorage.removeItem('token')

        console.error('Error logging out:', error);
        this.snackbar.open(
          `Error in logout, please try sometimes later`,
          'Ok',
          {
            duration: 2000,
          }
        );
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      complete: () => {
        this.router.navigate(['/']);
        this.changeDetectorRef.detectChanges();

      }
    });
  }


  updateSideBar(type: string): void {
    this.updateSideBarFF.emit(type);
  }
}
