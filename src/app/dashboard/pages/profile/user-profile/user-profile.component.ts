import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth.service';
import { tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule, CommonModule,MatIconModule, MatDialogModule],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  readonly authService = inject(AuthService)
  readonly snackBar = inject(MatSnackBar);
  readonly detectorRef = inject(ChangeDetectorRef)
  readonly matDialog = inject(MatDialog)
  user: any;
  plan: any;
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.getProfile().pipe(tap()).subscribe(
      profileData => {
        this.user = profileData.user
        this.plan = profileData.planDetails;
        console.log("pp", profileData);
        this.detectorRef.detectChanges();

      },
      error => {
        console.error('Error getting profile:', error);
        this.snackBar.open('Error retrieving profile: ' + error.message, 'close');
      }
    );
  }

  editProfile(): void { }

  editImage() {
    }
}
