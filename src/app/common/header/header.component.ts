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
})
export class HeaderComponent implements OnInit {
  token = localStorage.getItem('token')?.toString();
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
        console.log('df', this.userProfile);
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

  logout(): void {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.userProfile = null;
        this.authService._userProfileSubject.next(null);
        localStorage.removeItem('token');
        this.snackbar.open('Logout successful', 'Ok', {
          duration: 2000,
        });
        this.isLoading = false;

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
        this.isLoading = false;

      },
      complete: () => {
        this.changeDetectorRef.detectChanges();
        this.router.navigateByUrl('/');
      }
    });
  }


  updateSideBar(type: string): void {
    this.updateSideBarFF.emit(type);
  }
}
