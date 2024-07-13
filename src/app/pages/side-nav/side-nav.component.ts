import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { PasswordFormComponent } from '../../password/dialog/password-form/password-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatMenuModule, MatTableModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatCheckboxModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
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
  setFilter(type:string): void {
    this.filter_by = type;
  }

  filterPasswords(): void {
    const filterValueLower = this.filterValue.toLowerCase().trim();

  }
}
