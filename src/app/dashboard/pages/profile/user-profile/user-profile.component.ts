import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth.service';
import { tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule, CommonModule,],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  authService = inject(AuthService)
  snackBar = inject(MatSnackBar);
  detectorRef = inject(ChangeDetectorRef)
  user: any;
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.getProfile().pipe(tap()).subscribe(
      profileData => {
        this.user = profileData
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
}
