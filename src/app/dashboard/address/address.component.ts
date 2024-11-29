import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AddressService } from '../../services/address.service';
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

const defaultAddress: Address = { name: '', city: '', state: '', zipCode: '', country: '' };

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
    MatPaginatorModule

  ],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
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
  selection = new SelectionModel<any>(true, []);
  performAction(arg0: string) {
    throw new Error('Method not implemented.');
  }
  mode: MatDrawerMode = 'side';
  isSideBarOpen = true;
  addresses!: any[]

  selectedAddress = { ...defaultAddress };
  isEditMode = false;
  isShow = false;

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
  displayedColumns: string[] = ['select', 'favourite', '_id', 'name', 'city', 'state', 'zipCode', 'country', 'tags', 'actions'];
  constructor(private addressService: AddressService) {
    // const initialData = [
    //   {
    //     "_id": "673dc3a66a11d2fbaf8ed7c0",
    //     "userId": "6727432b5dc08625220cc722",
    //     "name": "ssa",
    //     "folder": "",
    //     "title": "",
    //     "firstName": "",
    //     "middleName": "",
    //     "lastName": "",
    //     "username": "",
    //     "gender": "Male",
    //     "birthday": null,
    //     "company": "",
    //     "address1": "",
    //     "address2": "",
    //     "city": "",
    //     "county": "",
    //     "state": "",
    //     "zipCode": "",
    //     "country": "",
    //     "timezone": "",
    //     "email": "",
    //     "phone": "",
    //     "phoneExtension": "",
    //     "eveningPhone": null,
    //     "eveningPhoneExtension": null,
    //     "createdAt": "2024-11-20T11:10:30.860Z",
    //     "updatedAt": "2024-11-20T11:10:30.860Z",
    //     "__v": 0
    //   }
    // ];

    // // Wrap the array in MatTableDataSource
    // this.addresses = new MatTableDataSource(initialData);
  }

  ngOnInit(): void {
    this.loadAddresses();
    this.isShow = !this.router.url.includes('profile');
  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (response: any) => {
        // this.addresses = [

        // ];
        this.addresses = Object.values(response.addresses); // Convert object to array

        // this.addresses = new MatTableDataSource(response.addresses);

        console.log('API Response:', response);
        console.log('Is Array:', Array.isArray(response)); //
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => console.error('Error fetching addresses:', error)
    });
  }

  onCreate(): void {
    this.addressService.createAddress(this.selectedAddress).subscribe({
      next: () => {
        this.loadAddresses();
        this.selectedAddress = { ...defaultAddress };
      },
      error: (error) => console.error('Error creating address:', error)
    });
  }

  onUpdate(): void {
    if (this.selectedAddress._id) {
      this.addressService.updateAddress(this.selectedAddress._id, this.selectedAddress).subscribe({
        next: () => {
          this.loadAddresses();
          this.selectedAddress = { ...defaultAddress };
          this.isEditMode = false;
        },
        error: (error) => console.error('Error updating address:', error)
      });
    }
  }

  OpenaddressFormDialog(address: any): void {
    const dialogRef = this.dialog.open(AddressFormComponent, {
      width: '900px',
      data: {
        address: address ? { ...address } : { ...defaultAddress },
        isEditMode: !!address?._id
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          if (result._id) {
            this.addressService.updateAddress(result._id, result).subscribe(() => this.loadAddresses());
          } else {
            this.addressService.createAddress(result).subscribe(() => this.loadAddresses());
          }
        }
      },
      error: (err) => console.error('Error closing dialog:', err)
    });
  }

  toggleSideBar(): void {
    this.isShow = !this.isShow;
  }

  onDelete(id: string): void {
    this.addressService.deleteAddress(id).subscribe({
      next: () => this.loadAddresses(),
      error: (error) => console.error('Error deleting address:', error)
    });
  }

  viewCardDetails(address: any): void {
    this.router.navigate(['/address', address._id]);
  }

  onCancel(): void {
    this.selectedAddress = { ...defaultAddress };
    this.isEditMode = false;
  }
  trackById(index: number, item: any): number {
    return item?._id;
  }
  isAllSelected(): boolean {
    // const numSelected = this.addresses.filter((address: { selected: any; }) => address.selected).length;
    // const numRows = this.addresses.length;
    return true;
  }
}
