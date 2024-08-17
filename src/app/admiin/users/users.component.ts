import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  invitation: string;
  created: Date;
}

const USERS: UserData[] = [
  { name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', invitation: 'Pending', created: new Date() },
  { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', invitation: 'Accepted', created: new Date() },
  // Add more user data as needed
];
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatIconModule, MatPaginatorModule, CommonModule, MatButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  displayedColumns: string[] = ['name', 'email', 'phone', 'invitation', 'action', 'created'];
  dataSource = new MatTableDataSource<UserData>(USERS);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUsersDialog(): void {
    throw new Error('Method not implemented.');
    }
  onEdit(user: UserData) {
    console.log('Edit user:', user);
    // Implement edit functionality
  }

  onDelete(user: UserData) {
    console.log('Delete user:', user);
    // Implement delete functionality
  }
}
