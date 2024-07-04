// home/pc-02/Music/password-app/src/app/password/password.component.ts
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AES } from 'crypto-js';
import {MatCardModule} from '@angular/material/card';
import { v4 as uuidv4 } from 'uuid';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { map, BehaviorSubject, tap, catchError, config } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PasswordService } from '../password.service'; // Import the new service
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PasswordFormComponent } from './dialog/password-form/password-form.component';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    AsyncPipe,
    MatIconModule
  ],
  providers: [{ provide: 'Window', useValue: window }],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent {
  passwords = []; // Use a Subject to manage password updates
  filteredPasswords$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  changedetect = inject(ChangeDetectorRef);
  passwordService = inject(PasswordService); // Inject the service
  displayedColumns: string[] = [
    '_id',
    'website',
    'username',
    'password',
    'action',
  ];
  headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token'), //the token is a variable which holds the token
  };
  readonly dialog = inject(MatDialog);

  filterValue: string = ''; // Add filterValue property
  constructor(@Inject('Window') public window: Window, private clipboard: Clipboard) { }
  ngOnInit(): void {
  

    // Fetch passwords and update the Subject
    this.getPasswords();
    // Subscribe to filteredPasswords$ to update the table
    this.filteredPasswords$.subscribe((filteredPasswords: any) => {
      this.passwords = filteredPasswords;
      this.changedetect.detectChanges();
    });
  }

  getPasswords(): void {
    this.passwordService.getPasswords().subscribe((passwords: any[]) => {
      this.filteredPasswords$.next(passwords); // Initialize filteredPasswords$ with fetched data
      console.log("pass", passwords);
      
    });

  }
  // Removed getPasswords() method



  autofill(id: string): void {
    this.filteredPasswords$
      .pipe(
        map((passwords: any[]) => passwords.find((password) => password._id === id))
      )
      .subscribe((passwordObject: { website: string | URL; username: string; password: string; }) => {
        if (passwordObject) {
          const urlObject = new URL(passwordObject.website);
          const searchParams = new URLSearchParams();
          searchParams.set('username', passwordObject.username);
          searchParams.set('password', passwordObject.password);
          urlObject.search = searchParams.toString();
          const autofilledUrl = urlObject.href;
          this.window.open(urlObject, 'blank');

        }
      });
  }

  generateStrongPassword(length: number = 12): void {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    this.changedetect.detectChanges();
  }



  delete(id: string): void {
    // Delete password using an observable
    this.passwordService
      .deletePassword(id)
      .pipe(
        tap(() => {
          // Update the filtered passwords array
          const currentValue = this.filteredPasswords$.getValue();
          const updatedValue = currentValue
            .filter((password: { _id: string; }) => password._id !== id)
            .slice();
          this.filteredPasswords$.next(updatedValue);
        }),
        catchError((error: any) => {
          console.error('err', error);
          throw error; // re-throw the error to prevent silent failures
        })
      )
      .subscribe({
        complete: () => {
          this.changedetect.detectChanges();
        },
      });
  }

  filterPasswords(): void {
    const filterValueLower = this.filterValue.toLowerCase().trim();
    const filter = this.filteredPasswords$.pipe(
      map((filterValue: any) => {
        if (!filterValueLower) {
          this.passwords = filterValue;
        } else {
          this.passwords = filterValue.filter(
            ({ website }: { website: string }) => {
              website.toLowerCase().includes(filterValueLower);
            }
          );
        }
      })
    );
  }



  trackById(index: number, item: any): number {
    return item?._id; // assuming your Password object has an 'id' property
  }


  // sharePassword(passwordId: string) {
  //   this.filteredPasswords$
  //     .pipe(
  //       map((passwords: any[]) => passwords.find((password) => password._id === passwordId))
  //     )
  //     .subscribe((passwordObject: { website: string | URL; username: string; password: string; key: string }) => {
  //       if (passwordObject) {
  //         // 2. Encrypt the password (if you're not using a secure sharing service)
  //         const encryptedPassword = AES.encrypt(
  //           passwordObject['password'],
  //           passwordObject['key']
  //         )// Implement encryption

  //         // 3. Copy the encrypted password to the clipboard
  //         this.clipboard.copy(encryptedPassword.toString());
              

  //         // 4. Provide feedback to the user
  //         alert('Password copied to clipboard!');
  //       }
  //     })
  // }

  sharePassword(passwordId: string) {
    this.passwordService.sharePassword(passwordId)
      .subscribe(
        (response) => {
          // Display the share link to the user
          this.openDialog('0ms', '0ms', `${response.shareLink}`);
        },
        (error) => {
          console.error('Error generating share link:', error);
        }
      );

  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, shareLink: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '1400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { shareLink }
    });
  }

  openPasswordFormDialog(password:any ): void {
    this.dialog.open(PasswordFormComponent, {
      width: '1400px',
      data:{password}
    }).afterClosed().subscribe((res)=>{
      if(res) this.getPasswords();
    })
  }
}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl:"share-dialog.html",
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatCardModule, MatIconModule , MatDialogClose, MatDialogTitle, MatDialogContent, MatSnackBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly clipboard = inject(Clipboard);
  readonly snackbar = inject(MatSnackBar)
  copyLink(): void {
   this.clipboard.copy(this.data.shareLink.toString());
   this.snackbar.open("Link is copy to clipboard", "close", {duration:3000})
  this.dialogRef.close()
  }
}