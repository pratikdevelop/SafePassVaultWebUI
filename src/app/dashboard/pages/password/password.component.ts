import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Inject,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { PasswordService } from '../../../services/password.service';
import { PasswordFormComponent } from '../dialog/password-form/password-form.component';
import { OrganizationComponent } from '../organization/organization.component';
import { NotesFormComponent } from '../dialog/notes/notes-form.component';
import { CreditCardFormComponent } from '../dialog/credit-card-form/credit-card-form.component';
import { IdproofformComponent } from '../dialog/idproofform/idproofform.component';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError, tap } from 'rxjs';
import { Passwords } from '../../dashboard.component';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [{ provide: 'Window', useValue: window }],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent {
  passwords: any[] = [];
  passwordIds = [];
  snackbar = inject(MatSnackBar);
  selectedTags: string = 'none';
  filter_by: string = '';
  action: string = '';
  changedetect = inject(ChangeDetectorRef);
  passwordService = inject(PasswordService);
  displayedColumns: string[] = [
    'select',
    '_id',
    'name',
    'website',
    'username',
    'password',
    'tags',
    'favourite',
    'update_at',
    'action',
  ];
  readonly dialog = inject(MatDialog);
  readonly window = inject(Window);
  isLoading: boolean = true;
  filterValue: string = '';
  selection = new SelectionModel<Passwords>(true, []);

  constructor() {
    this.passwordService.filteredPasswords$.subscribe(
      (filteredPasswords: any[]) => {
        if (filteredPasswords && filteredPasswords.length > 0) {
          this.passwords = filteredPasswords;
        } else {
          if (this.isLoading) {
            this.getPasswords();
          }
        }
      },
      (error) => {
        this.getPasswords();
      }
    );
  }

  getPasswords(event = null): void {
    this.isLoading = true;
    this.passwordService.getPasswords().subscribe(
      (passwords: any[]) => {
        this.isLoading = false;
        this.passwords = passwords;
        this.changedetect.detectChanges();
      },
      (error) => {
        this.passwords = [];
        this.isLoading = false;
        this.changedetect.detectChanges();
      }
    );
  }

  autofill(password: any): void {
    if (
      !password.website?.startsWith('http://') &&
      !password.website?.startsWith('https://')
    ) {
      password.website = `https://${password.website}`;
    }

    try {
      const urlObject = new URL(password.website);
      const searchParams = new URLSearchParams();
      searchParams.set('username', password.username);
      searchParams.set('password', password.password);
      urlObject.search = searchParams.toString();
      this.window.open(urlObject.toString(), '_blank');
    } catch (error) {
      console.error('Error opening website:', error);
    }
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
    this.passwordService
      .deletePassword(id)
      .pipe(
        tap(() => {
          this.getPasswords();
        }),
        catchError((error: any) => {
          console.error('err', error);
          throw error;
        })
      )
      .subscribe({
        complete: () => {
          this.changedetect.detectChanges();
        },
      });
  }

  trackById(index: number, item: any): number {
    return item?._id;
  }

  sharePassword(passwordId: string) {
    this.passwordService.sharePassword(passwordId).subscribe(
      (response) => {},
      (error) => {
        console.error('Error generating share link:', error);
      }
    );
  }

  openPasswordFormDialog(password: any): void {
    this.dialog
      .open(PasswordFormComponent, {
        width: '2000px',
        data: { password },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getPasswords();
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.passwords.length;
    return numSelected === numRows;
  }

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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row._id + 1
    }`;
  }

  updateFavourites(passwordId: string): void {
    this.passwordService.addToFavorites(passwordId).subscribe(
      (response) => {
        console.log('Password added to favorites successfully', response);
        this.getPasswords();
        // Handle success, e.g., update UI
      },
      (error) => {
        console.error('Error adding password to favorites', error);
        // Handle error, e.g., display error message
      }
    );
  }

  viewPassword(id: string): void {
    console.log('ff');
  }
}
