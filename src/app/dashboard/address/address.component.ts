// src/app/address-crud/address-crud.component.ts
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

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [MatTableModule, MatListModule, MatMenuModule, MatIconModule, CommonModule, MatButtonModule, MatSidenavModule, SideNavComponent, HeaderComponent, RouterModule, MatDialogModule, AddressFormComponent],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  mode: MatDrawerMode = 'side';
  isSideBarOpen: boolean = true;
  addresses: Address[] = [];
  selectedAddress: Address = { name: '', city: '', state: '', zipCode: '', country: '' };
  isEditMode = false;
  readonly router = inject(Router);
  readonly dialog = inject(MatDialog)
  readonly changeDetectorRef = inject(ChangeDetectorRef);

  isShow: boolean = false;
  displayedColumns = ['name', 'city', 'state', 'zipCode', 'country', 'actions']

  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
    this.loadAddresses();
    if (this.router.url.includes('profile')) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }
  }

  loadAddresses(): void {
    this.addressService.getAddresses().subscribe((addresses) => {
      this.addresses = addresses;
      this.changeDetectorRef.detectChanges();
    });
  }

  onCreate(): void {
    this.addressService.createAddress(this.selectedAddress).subscribe(() => {
      this.loadAddresses();
      this.selectedAddress = { name: '', city: '', state: '', zipCode: '', country: '' };
    });
  }

  onUpdate(): void {
    if (this.selectedAddress._id) {
      this.addressService.updateAddress(this.selectedAddress._id, this.selectedAddress).subscribe(() => {
        this.loadAddresses();
        this.selectedAddress = { name: '', city: '', state: '', zipCode: '', country: '' };
        this.isEditMode = false;
      });
    }
  }
  performAction(type: string): void {

  }

  OpenaddressFormDialog(address?: Address | null): void {
    if (address) {
      this.selectedAddress = address;
    }
    this.dialog.open(AddressFormComponent, {
      width: '500px',
      data: {
        addressId: this.selectedAddress._id,
        isEditMode: this.isEditMode

      }
    }).afterClosed().subscribe({
      next: (address) => {
        if (address) {
          if (this.selectedAddress._id) {
            this.selectedAddress = address;
            this.isEditMode = true
          } else
            this.selectedAddress = address;
        }
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  toggleSideBar(): void {
    this.isShow = !this.isShow;
  }

  onDelete(id: string): void {
    this.addressService.deleteAddress(id).subscribe(() => {
      this.loadAddresses();
    });
  }
  viewCardDetails(address: Address): void {
    this.router.navigate(['/address', address._id]);

  }

  onCancel(): void {
    this.selectedAddress = { name: '', city: '', state: '', zipCode: '', country: '' };
    this.isEditMode = false;
  }
}
