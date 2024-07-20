import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PasswordFormComponent } from '../password/dialog/password-form/password-form.component';
import { OrganizationComponent } from '../organization/organization.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Passwords } from '../password/password.component';
import { PasswordService } from '../../services/password.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatListModule, MatButtonModule,MatIconModule, MatMenuModule,MatSnackBarModule],
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  dialog = inject(MatDialog)
  service = inject(PasswordService)
  snackbar = inject(MatSnackBar)
  filterValue: string = '';
  selectedTags: string = 'none';
  filter_by: string = "";
  action: string = ''
  @Input()
  passwordIds!: Passwords[];
  @Output() updatePasswordsTable = new EventEmitter<any>();
  openPasswordFormDialog(): void {
    const dialog = this.dialog.open(PasswordFormComponent, {
      width: '1400px',
    })
    dialog.afterClosed().subscribe((response)=>{
      if(response) {
        this.updatePasswordsTable.emit();
      }
    })
  }
  performAction(vlaue: string): void {
    switch(vlaue) {
      case 'delete':
        const ids = this.passwordIds?.map((password)=>{return password._id})
        this.service.deleteMultiplePasswords(ids ?? ['']).subscribe((response)=>{
          this.snackbar.open('Password deleted Successfully', 'close', {duration:2000})
          this.updatePasswordsTable.emit();

        })                
    }
  }
  setFilter(type: string): void {
    this.filter_by = type;
  }

  filterPasswords(): void {
    const filterValueLower = this.filterValue.toLowerCase().trim();

  }

  createOrganization(): void {
    this.dialog.open(OrganizationComponent)
  }
}
