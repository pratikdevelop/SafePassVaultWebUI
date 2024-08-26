import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Observable, startWith, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SharedItemService } from '../shared-item.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatSelectModule,MatToolbarModule, MatButtonModule, MatOptionModule, ReactiveFormsModule,CommonModule, MatInputModule, FormsModule, MatCheckboxModule, MatListModule, MatIconModule, MatAutocompleteModule, MatChipsModule],
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.css'
})
export class ShareDialogComponent {
  users: any[] = []; // Replace `any` with the appropriate user type
  filteredUsers: any[] = [];
  selectedUsers: any[] = []; // Array to store selected users
  shareForm: FormGroup;
  availablePermissions = ['view', 'edit', 'delete'];


  constructor(
    private dialogRef: MatDialogRef<ShareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: string, itemType: string },
    private fb: FormBuilder,
    private userService: AuthService,
    private sharedItemService: SharedItemService
  ) {
    this.shareForm = this.fb.group({
      permissions: [[]], // For multi-select permissions

      users: [[]] // For selected users
    });


    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe((users: any[]) => {
      this.users = users;
      this.shareForm.get('users')?.valueChanges.pipe(
        startWith('')).subscribe(value =>
          this.filteredUsers =  this._filter(value))
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value?.toLowerCase();
    return this.users.filter(user => user.recipient.name.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    const user = event.option.value;
    if (this.selectedUsers.indexOf(user) === -1) {
      this.selectedUsers.push(user);
    }
    this.shareForm.controls['users'].setValue('')
  }

  removeUser(user: any) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
  }

  share() {
    const permissions = this.shareForm.value.permissions;
    this.sharedItemService.shareItem({
      itemId: this.data.items,
      itemType: this.data.itemType,
      users: this.selectedUsers.map(user => ({ userId: user._id, permissions }))
    }).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  close() {
    this.dialogRef.close();
  }

}
