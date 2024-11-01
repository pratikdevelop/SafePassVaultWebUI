import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploaderModule } from "angular-uploader";
import { tap } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { EditProfileComponent } from './dailog/edit-profile/edit-profile.component';

interface ProfileData {
  user: any; // Define user interface based on actual data structure
  planDetails: any; // Define plan interface based on actual data structure
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, NgOptimizedImage,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule,
    UploaderModule
  ],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly detectorRef = inject(ChangeDetectorRef);
  private readonly matDialog = inject(MatDialog);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly commonService = inject(CommonService);

  selectedFile: File | null = null;
  selectedImageUrl: SafeUrl | null = null;
  user: any; // Define user interface if possible
  plan: any; // Define plan interface if possible

  ngOnInit(): void {
    this.getProfile();
  }

  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }

  getProfile(): void {
    this.authService.getProfile().pipe(
      tap() // Add any necessary side-effects here
    ).subscribe({
      next: (profileData: ProfileData) => {
        this.user = profileData.user;
        this.plan = profileData.planDetails;
        this.detectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error getting profile:', error);
        this.snackBar.open(`Error retrieving profile: ${error.message}`, 'close');
      }
    });
  }

  editProfile(): void {
    const dialogRef = this.matDialog.open(EditProfileComponent, {
      width: '800px',
      data: this.user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProfile();
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        this.selectedFile = file;
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.selectedFile = input.files[0];
          this.authService.uploadFile(this.selectedFile).subscribe({
            next: (response) => {
              this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 });
            },
            error: (err) => {
              this.snackBar.open('File upload failed: ' + err.message, 'Close', { duration: 3000 });
            }
          });
        }
      this.snackBar.open(`File selected: ${file.name}`, 'close', { duration: 2000 });
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      

      // Placeholder for upload method
      // Example:
      // this.authService.uploadImage(formData).subscribe({
      //   next: (response) => {
      //     this.snackBar.open('Image uploaded successfully', 'close', { duration: 2000 });
      //     this.resetSelectedFile();
      //   },
      //   error: (error) => {
      //     this.snackBar.open(`Image upload failed: ${error.message}`, 'close', { duration: 2000 });
      //   }
      // });
    } else {
      this.snackBar.open('Please select a file first', 'close', { duration: 2000 });
    }
  }

  private resetSelectedFile(): void {
    this.selectedFile = null;
    this.selectedImageUrl = null;
  }
}
