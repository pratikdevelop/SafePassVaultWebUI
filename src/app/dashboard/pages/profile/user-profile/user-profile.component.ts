import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../services/auth.service';
import { tap } from 'rxjs';
import { UploaderModule } from "angular-uploader";

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgOptimizedImage } from '@angular/common'
import { EditProfileComponent } from './dailog/edit-profile/edit-profile.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../../../services/common.service';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule, CommonModule,MatIconModule, MatDialogModule, NgOptimizedImage,
    UploaderModule, MatIconModule // <-- Add the Uploader module here.

  ],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  selectedImageUrl: any;
  readonly authService = inject(AuthService)
  readonly snackBar = inject(MatSnackBar);
  readonly detectorRef = inject(ChangeDetectorRef)
  readonly matDialog = inject(MatDialog)
  readonly  sanitizer = inject(DomSanitizer)
  readonly commonService = inject(CommonService);

  selectedFile: File | null = null;

  user: any;
  plan: any;
  ngOnInit(): void {
    this.getProfile();
  }

  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
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
    // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Optional: Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl); // Safe preview URL

      this.snackBar.open('File selected: ' + file.name, 'close', {
        duration: 2000
      });
    }
  }
  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Example: Upload the image to an API endpoint
      // this.http.post('https://your-api-endpoint.com/upload', formData).subscribe(
      //   (response) => {
      //     this.snackbar.open('Image uploaded successfully', 'close', {
      //       duration: 2000
      //     });
      //     // Optionally reset selected file and image preview
      //     this.selectedFile = null;
      //     this.selectedImageUrl = null;
      //   },
      //   (error) => {
      //     this.snackbar.open('Image upload failed: ' + error.message, 'close', {
      //       duration: 2000
      //     });
      //   }
      // );
    } else {
      this.snackBar.open('Please select a file first', 'close', {
        duration: 2000
      });
    }
  }
}
