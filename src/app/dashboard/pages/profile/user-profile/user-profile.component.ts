import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth.service';
import { tap } from 'rxjs';
import { UploaderModule } from "angular-uploader";

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgOptimizedImage } from '@angular/common'
import { EditProfileComponent } from './dailog/edit-profile/edit-profile.component';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule, CommonModule,MatIconModule, MatDialogModule, NgOptimizedImage,
    UploaderModule // <-- Add the Uploader module here.

  ],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
onUpload() {
throw new Error('Method not implemented.');
}
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

  editProfile(): void {
    const dialogRef = this.matDialog.open(EditProfileComponent, {
      width: '800px',
      data: this.user,

      });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result){
        this.getProfile();
        }
    })
   }
}
