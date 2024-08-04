import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { PasswordService } from '../../../services/password.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Passwords } from '../dashboard.component';
import { PasswordFormComponent } from '../dialog/password-form/password-form.component';
import { catchError, tap } from 'rxjs';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [MatTableModule, MatSortModule, FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    SideNavComponent,
    MatCheckboxModule,
    MatTooltipModule,
    CommonModule,
    MatMenuModule,
    MatChipsModule,
    MatSidenavModule,
    MatFormFieldModule, MatInputModule],
  providers: [{ provide: 'Window', useValue: window }],
  
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  passwords: any[] = []; // Use a Subject to manage password updates
  passwordIds= [];
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
    'action'
  ];
  readonly dialog = inject(MatDialog);
  isLoading: boolean = true;
  filterValue: string = ''; // Add filterValue property
  selection = new SelectionModel<Passwords>(true, []);
  constructor(@Inject('Window') public window: Window) {
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

  getPasswords(event=null): void {
    this.isLoading = true;
    this.passwordService.getPasswords().subscribe((passwords: any[]) => {
      this.isLoading = false;
      this.passwords = passwords;
      console.log("pp", passwords);
      
      this.changedetect.detectChanges();
    }, error => {
      this.passwords = [];
      this.isLoading = false;
      this.changedetect.detectChanges();
    });

  }
  autofill(password: any): void {
    if (!password.website?.startsWith('http://') && !password.website?.startsWith('https://')) {
      password.website = `https://${password.website}`; // Add https by default
    }

    // Handle potential errors gracefully
    try {
      const urlObject = new URL(password.website);
      const searchParams = new URLSearchParams();
      searchParams.set('username', password.username);
      searchParams.set('password', password.password);// Assuming these are for demonstration purposes, avoid storing credentials in plain text
      urlObject.search = searchParams.toString();
      this.window.open(urlObject.toString(), '_blank');
    } catch (error) {
      console.error('Error opening website:', error);
      // Handle the error gracefully, e.g., display an error message to the user
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

        },
        (error) => {
          console.error('Error generating share link:', error);
        }
      );

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

  updateFavourites(passwordId: string): void {
      this.passwordService.addToFavorites(passwordId)
      .subscribe(
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

  viewPassword(id:string): void {
    console.log("ff");
    
  }

}
