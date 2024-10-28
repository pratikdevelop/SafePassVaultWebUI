import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { PasswordService } from '../../services/password.service';
import { PasswordFormComponent } from '../../dialog/password-form/password-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError, tap } from 'rxjs';
import { ShareDialogComponent } from '../../dialog/share-dialog/share-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ViewPasswordComponent } from '../../dialog/view-password/view-password.component';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ViewPasswordComponent,
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
    MatSidenavModule,
  ],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  passwords: any[] = [];
  passwordIds = [];
  snackbar = inject(MatSnackBar);
  selectedTags: string = 'none';
  filter_by: string = '';
  action: string = '';
  private readonly changeDetectorReforRef = inject(ChangeDetectorRef);
  private readonly passwordService = inject(PasswordService);
  displayedColumns: string[] = [
    'select',
    'favourite',
    '_id',
    'name',
    'website',
    'username',
    'password',
    'tags',
    'update_at',
    'action',
  ];
  private readonly dialog = inject(MatDialog);
  private readonly commonService = inject(CommonService);
  private readonly router = inject(ActivatedRoute);
  isLoading: boolean = true;
  searchTerm: string = '';
  selection = new SelectionModel<any>(true, []);
  password: any[] = [];
  isOpened = false;
  folderId: any;

  constructor() {}

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: any) => {
      this.folderId = params.get('folderId'); // Get folderId from the route
      this.getPasswords();
    });
  }

  getPasswords(): void {
    this.isLoading = true;
    this.passwordService
      .getPasswords(this.folderId, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          this.passwords = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error);
        },
        complete: () => {
          this.isLoading = false;
          this.changeDetectorReforRef.detectChanges();
        },
      });
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
    this.changeDetectorReforRef.detectChanges();
  }

  deletePasswords(id?: string): void {
    const ids =
      id ??
      this.selection.selected
        .map((pass) => {
          return pass._id;
        })
        .join(',');
    this.passwordService
      .deletePassword(ids)
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
          this.changeDetectorReforRef.detectChanges();
        },
      });
  }

  trackById(index: number, item: any): number {
    return item?._id;
  }

  sharePassword(passwordId?: string): void {
    const items =
      passwordId ??
      this.selection.selected
        .map((pass) => {
          return pass._id;
        })
        .join(',');
    this.dialog.open(ShareDialogComponent, {
      width: '500px',
      data: {
        items,
        itemType: 'password',
      },
    });
  }

  openPasswordFormDialog(password: any): void {
    this.dialog
      .open(PasswordFormComponent, {
        width: '2000px',
        data: { password, folderId: this.folderId },
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row._id + 1
    }`;
  }

  updateFavourites(passwordId?: string): void {
    const ids =
      passwordId ??
      this.selection.selected
        .map((pass) => {
          return pass._id;
        })
        .join(',');
    console.log('id', ids);

    this.passwordService.addToFavorites(ids).subscribe(
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

  viewPassword(password: any): void {
    console.log(password);
    this.password = password;
    this.isOpened = true;
  }
  exportPassword(): void {
    const ids = this.selection.selected
      .map((pass) => {
        return pass._id;
      })
      .join(',');
    this.passwordService.exportPasswordsAsCsv(ids).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passwords.csv';
      a.click();
    });
    // Implement preview functionality
  }

  performAction(fileId: string): void {
    // Implement share functionality
  }
  searchPassword(): void {
    console.log('dd', this.searchTerm);

    this.passwordService
      .getPasswords(this.searchTerm)
      .subscribe((response: any) => {
        this.passwords = response;
      });
  }
  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }
}
