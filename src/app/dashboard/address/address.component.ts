import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AddressService } from '../../address.service';
import { Address } from '../../interfaces/address';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from '../../common/side-nav/side-nav.component';
import { HeaderComponent } from '../../common/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AddressFormComponent } from './address-form/address-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    SideNavComponent,
    HeaderComponent,
    RouterModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  mode: MatDrawerMode = 'side';
  isSideBarOpen = true;
  addresses!: any[];
  isLoading: boolean = true;
  selectedAddress?: Address;
  isEditMode = false;
  isShow = false;
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly addressService = inject(AddressService);
  private readonly snackBar = inject(MatSnackBar);
  displayedColumns: string[] = [
    'select',
    'favourite',
    '_id',
    'name',
    'city',
    'state',
    'zipCode',
    'country',
    'tags',
    'actions',
  ];

  ngOnInit(): void {
    this.loadAddresses();
    this.isShow = !this.router.url.includes('profile');
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.addressService.getAddresses().subscribe({
      next: (response: any) => {
        this.addresses = Object.values(response.addresses); // Convert object to array
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching addresses:', error);
		this.snackBar.open('Error fetching the address records', 'close', {
			duration: 2000,
			direction:"ltr"
		})
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  OpenaddressFormDialog(address: any): void {
    const dialogRef = this.dialog.open(AddressFormComponent, {
      width: '900px',
      data: {
        address: address ? { ...address } : {},
        isEditMode: !!address?._id,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {

          this.loadAddresses();
        }
      },
      error: (err) => console.error('Error closing dialog:', err),
    });
  }

  toggleSideBar(): void {
    this.isShow = !this.isShow;
  }

  onDelete(id: string): void {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.loadAddresses();
		this.snackBar.open(`
			Address deleted successfully`,
			`close
			`, {
				duration: 2000,
				direction:"ltr"
				})
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting address:', error);
		this.snackBar.open('Error deleting the address', 'close', {
			duration: 2000,
			direction:"ltr"
			})
			
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  viewCardDetails(address: any): void {
    this.router.navigate(['/address', address._id]);
  }

  onCancel(): void {
    this.selectedAddress = {};
    this.isEditMode = false;
  }
  trackById(index: number, item: any): number {
    return item?._id;
  }
  isAllSelected(): boolean {
    const numSelected = this.addresses.filter(
      (address: { selected: any }) => address.selected
    ).length;
    const numRows = this.addresses.length;
    return numSelected === numRows;
  }
  checkboxLabel(row: any = null) {
    throw new Error('Method not implemented.');
  }
  toggleAllRows() {
    throw new Error('Method not implemented.');
  }
  updateFavourites(arg0: any) {
    throw new Error('Method not implemented.');
  }
  removeTag(arg0: any, _t149: any) {
    throw new Error('Method not implemented.');
  }
  performAction(arg0: string) {
    throw new Error('Method not implemented.');
  }
}
