import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UserFormComponent } from './user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationService } from '../../../services/organization.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatIconModule, MatPaginatorModule, CommonModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  toggleSideBar() {
    throw new Error('Method not implemented.');
  }

  displayedColumns: string[] = ['name', 'email', 'phone', 'invitation', 'action', 'created'];
  dataSource = [];
  private readonly dialog = inject(MatDialog)
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  private readonly organizationService = inject(OrganizationService)
  private readonly authService = inject(AuthService)
  private readonly snackBar = inject(MatSnackBar);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.organizationService.getInvitations().subscribe({
      next: (users: any) => {
        console.log('users', users);
        this.dataSource = users;
        this.changeDetectorRef.detectChanges()
      },
      error: (error) => {
        console.log('error', error);
        this.changeDetectorRef.detectChanges()
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  openUsersDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent)
    dialogRef.afterClosed().subscribe({
      next: (confirmation: any) => {
        if (confirmation) {
          this.organizationService.getInvitations().subscribe({
            next: (users: any) => {
              console.log('users', users);
              this.dataSource = users;
              this.changeDetectorRef.detectChanges()
            },
            error: (error: any) => {
              console.error('error', error);
              this.changeDetectorRef.detectChanges()
            }
          })

        }

      }

    })
  }
  onEdit(user: any) {
    console.log('Edit user:', user);
    // Implement edit functionality
  }

  onDelete(user: any) {
    console.log('Delete user:', user);
    // Implement delete functionality
  }

  resendInvitation(user: any): void {
    console.log('Resend invitation:', user);
    this.authService.resendInvitation(user.organization, user.recipient._id).subscribe({
      next: (Response) => {
        this.snackBar.open('Invitation resent successfully', 'OK', {
          duration: 2000,
        });
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('error', error);
        this.changeDetectorRef.detectChanges();
      }
    })

  }
}
