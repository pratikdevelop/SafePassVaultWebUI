import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SecurityComponent } from './security/security.component';
import { PasswordChangeComponent } from './password-change/password-change.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, SecurityComponent, PasswordChangeComponent, MatButtonModule, MatSnackBarModule, CommonModule, FormsModule, ReactiveFormsModule, MatExpansionModule, MatCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  enableSecurityQuestions = false; // Flag for optional security questions
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  authService = inject(AuthService)
  snackBar = inject(MatSnackBar);
  detectorRef = inject(ChangeDetectorRef)
  user: any = {};
  tab = 0;

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.authService.getProfile()
      .subscribe(
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
  setTab(tabNo: number): void {
    this.tab= tabNo;
  }
}
