import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SecretService } from '../../services/secret.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../../common/header/header.component';
import { SideNavComponent } from '../../common/side-nav/side-nav.component';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SecretsManagementFormComponent } from './dialog/secrets-management-form/secrets-management-form.component';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-secret-manager',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    HeaderComponent,
    MatIconModule,
    SideNavComponent,
    MatSidenavModule,
    MatCheckboxModule
  ],
  templateUrl: './secret-manager.component.html',
  styleUrl: './secret-manager.component.css',
})
export class SecretManagerComponent implements OnInit {
  checkboxLabel(row: any = null): string {
    throw new Error('Method not implemented.');
  }
  isAllSelected(): boolean {
    throw new Error('Method not implemented.');
  }
  toggleAllRows() {
    throw new Error('Method not implemented.');
  }
  searchTerm: any;
  element: any;
  selection: any;
  toggleSideBar() {
    throw new Error('Method not implemented.');
  }

  secrets: any[] = [];
  newSecret: FormGroup;
  displayedColumns: string[] = [
    'id',
    'name',
    'type',
    'description',
    'created_by',
    'created_At',
    'updated_At',
    'action',
  ]; // Columns to display in the table
  isBreakPoint!: boolean;
  isSidebarOpen!: boolean;
  mode: MatDrawerMode = 'side';
  isShow: boolean = false;

  constructor(
    private secretService: SecretService,
    private formBuilder: FormBuilder,
    private chageDetectorRef: ChangeDetectorRef,
    private router: Router,
    private commonService: CommonService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) {
    this.newSecret = this.formBuilder.group({
      name: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
      description: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadSecrets();
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((result) => {
        if (result.breakpoints['(max-width: 600px)']) {
          this.isBreakPoint = true;
          this.isSidebarOpen = false;
          this.mode = 'over';
        } else {
          this.isSidebarOpen = true;
          this.isBreakPoint = false;
          this.mode = 'side';
        }
      });

    this.commonService.sideBarOpen.subscribe((res) => {
      if (this.isBreakPoint) {
        this.isSidebarOpen = res;
      }
    });
    if (this.router.url.includes('profile')) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }
  }

  loadSecrets() {
    this.secretService.getSecrets().subscribe({
      next: (data: any) => {
        this.secrets = data.secrets;
        this.chageDetectorRef.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  openSecretsFormDialog(secret: any): void {
    const dialogRef = this.dialog.open(SecretsManagementFormComponent, {
      width: '500px',
      data: { secret },
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if (result) {
          this.loadSecrets();
        }
      },
    });
  }

  deleteCard(id: any): void {
    this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: {
        title: 'Delete Secret',
        description: 'Are you sure you want to delete this Secrets?',
      }
    }
    ).afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.secretService.deleteSecret(id).subscribe({
          next: (response) => {
            this.loadSecrets();
          },
          error: (error) => {

          }
        })
      }
    })
  }
  updateFavourites(arg0: any) {
    throw new Error('Method not implemented.');
  }
  viewCardDetails(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
