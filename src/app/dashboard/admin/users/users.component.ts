import { Component, inject, OnInit, ViewChild } from '@angular/core';
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

  displayedColumns: string[] = ['name', 'email', 'phone', 'invitation', 'action', 'created'];
  dataSource = new MatTableDataSource<any>();
  dialog = inject(MatDialog)
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  organizationService = inject(OrganizationService)
  authService = inject(AuthService)
  snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.organizationService.getInvitations().subscribe((res: any)=>{
      console.log('res', res);
      
      this.dataSource.data = res
    })
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUsersDialog(): void {
   const dialogRef = this.dialog.open(UserFormComponent)
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
    this.authService.resendInvitation(user.organization, user.recipient._id).subscribe((Response)=>{
      console.log('Response', Response);
      this.snackBar.open('Invitation resent successfully', 'OK', {
        duration: 2000,
        });

    })
    
  }
}
