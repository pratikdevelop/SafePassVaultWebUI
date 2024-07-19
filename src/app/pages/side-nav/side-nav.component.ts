import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PasswordFormComponent } from '../password/dialog/password-form/password-form.component';
import { OrganizationComponent } from '../organization/organization.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatListModule, MatButtonModule,MatIconModule, MatMenuModule,],
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  dialog = inject(MatDialog)
  filterValue: string = '';
  selectedTags: string = 'none';
  filter_by: string = "";
  action: string = ''

  openPasswordFormDialog(): void {
    this.dialog.open(PasswordFormComponent, {
      width: '1400px',
    })
  }
  performAction(vlaue: string): void {
    this.action = vlaue
    console.log("event", this.action);

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
