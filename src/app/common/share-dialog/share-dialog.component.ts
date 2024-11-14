import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { startWith } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SharedItemService } from '../../services/shared-item.service';

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, MatSelectModule, MatToolbarModule, MatButtonModule, MatOptionModule,
    ReactiveFormsModule, CommonModule, MatInputModule, FormsModule, MatCheckboxModule,
    MatListModule, MatIconModule, MatAutocompleteModule, MatChipsModule, MatDialogModule,
    MatListModule
  ],
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
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
    private sharedItemService: SharedItemService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.shareForm = this.fb.group({
      permissions: [[]], // For multi-select permissions
      shareMethod: [''], // Will be used to switch between "user", "email", and "link"
      users: [[]], // For selected users
      recipientEmail: [''], // For recipient's email (used when "Email" is selected)
      subject: [''], // Email subject
      message: [''], // Email message body
      usePassword: [false], // Checkbox for password protection
      password: [''], // Password for email protection
      shareLink: [''] // Link for sharing when "link" is selected
    });

    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe((users: any[]) => {
      this.users = users;
      this.shareForm.get('users')?.valueChanges.pipe(
        startWith('')
      ).subscribe(value => this.filteredUsers = this._filter(value));
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
    this.shareForm.controls['users'].setValue('');
  }

  removeUser(user: any) {
    this.selectedUsers = this.selectedUsers.filter(u => u !== user);
  }

  updateTerm($event: any) {
    this.changeDetectorRef.detectChanges();
  }

  // Function to toggle the password field visibility
  togglePasswordField(event: any) {
    if (!event.checked) {
      this.shareForm.get('password')?.reset();
    }
  }

  share() {
    const formData = this.shareForm.value;
    const permissions = formData.permissions;

    if (formData.shareMethod === 'user') {
      // this.sharedItemService.shareItem({
      //   itemId: this.data.items,
      //   itemType: this.data.itemType,
      //   users: this.selectedUsers.map(user => ({ userId: user._id, permissions }))
      // }).subscribe(() => {
      //   this.dialogRef.close(true);
      // });
    } else if (formData.shareMethod === 'email') {
      const emailData = {
        itemId: this.data.items,
        itemType: this.data.itemType,
        recipientEmail: formData.recipientEmail,
        subject: formData.subject,
        message: formData.message,
        password: formData.usePassword ? formData.password : null // Send password if set
      };

        this.dialogRef.close(emailData);
    } 
  }

  close() {
    this.dialogRef.close();
  }
}
