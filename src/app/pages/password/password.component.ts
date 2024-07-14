// home/pc-02/Music/password-app/src/app/password/password.component.ts
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { tap, catchError } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PasswordService } from '../../services/password.service'; // Import the new service
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
import { SideNavComponent } from '../side-nav/side-nav.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Passwords {
  '_id': string
    'name': string
    'website': string
    'username': string
    'password': string
    'update_at': string
}

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule, 
    SideNavComponent, 
    MatCheckboxModule,
    MatTooltipModule
  ],
  providers: [{ provide: 'Window', useValue: window }],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PasswordComponent {
  passwords: any[] = []; // Use a Subject to manage password updates
  changedetect = inject(ChangeDetectorRef);
  passwordService = inject(PasswordService); // Inject the service
  displayedColumns: string[] = [
    'select',
    '_id',
    'name',
    'website',
    'username',
    'password',
    'update_at',
    'action'
  ];
  readonly dialog = inject(MatDialog);
  isLoading: boolean = true;
  filterValue: string = ''; // Add filterValue property
  selection = new SelectionModel<Passwords>(true, []);
  constructor(@Inject('Window') public window: Window, private clipboard: Clipboard) { }
  ngOnInit(): void {
    this.passwordService.filteredPasswords$.subscribe((filteredPasswords: any[]) => {

      if (filteredPasswords && filteredPasswords.length > 0) {
        this.passwords = filteredPasswords;
      } else {
        if (this.isLoading) {
          this.getPasswords();
        }
      }
    }, error => {
      this.getPasswords();
    });
  }

  getPasswords(): void {
    this.isLoading = true;
    this.passwordService.getPasswords().subscribe((passwords: any[]) => {
      this.isLoading = false;
      this.passwords = passwords;
      this.changedetect.detectChanges();
    }, error => {
      this.passwords = [];
      this.isLoading = false;
      this.changedetect.detectChanges();
    });

  }
  autofill(password: any): void {
      const urlObject = new URL(password.website);
      const searchParams = new URLSearchParams();
      searchParams.set('username', password.username);
      searchParams.set('password', password.password);
      urlObject.search = searchParams.toString();
      this.window.open(urlObject, 'blank');
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
          this.getPasswords();
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

  trackById(index: number, item: any): number {
    return item?._id; // assuming your Password object has an 'id' property
  }

  sharePassword(passwordId: string) {
    this.passwordService.sharePassword(passwordId)
      .subscribe(
        (response) => {
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

  openPasswordFormDialog(password: any): void {
    this.dialog.open(PasswordFormComponent, {
      width: '2000px',
      data: { password }
    }).afterClosed().subscribe((res) => {
      if (res) this.getPasswords();
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.passwords.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.passwords);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Passwords): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row._id + 1}`;
  }
}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: "share-dialog.html",
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatCardModule, MatIconModule, MatDialogClose, MatDialogTitle, MatDialogContent, MatSnackBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly clipboard = inject(Clipboard);
  readonly snackbar = inject(MatSnackBar)
  copyLink(): void {
    this.clipboard.copy(this.data.shareLink.toString());
    this.snackbar.open("Link is copy to clipboard", "close", { duration: 3000 })
    this.dialogRef.close()
  }
}