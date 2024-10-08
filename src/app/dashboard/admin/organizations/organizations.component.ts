import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrganizationComponent } from '../../../dialog/organization/organization.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatDialogModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css'
})
export class OrganizationsComponent implements OnInit {
  organizations: any[] = [];
  displayedColumns: string[] = ['_id', 'name', 'description', 'ownerName', 'ownerEmail', 'createdAt', 'updatedAt'];

  constructor(
    private readonly organizationsService: OrganizationService,
    private readonly dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.getOrganizations();
  }

  getOrganizations(): void {
    this.organizationsService.getOrganizations().subscribe((organizations: any) => {
      this.organizations = organizations; 
      console.log('ggg', organizations);
      this.changeDetectorRef.detectChanges();
      });
  }
  openOrganizationDialog(): void {
    const dialogRef = this.dialog.open(OrganizationComponent, {
      width: '500px',
      });
    dialogRef.afterClosed().subscribe((res)=>{
      console.log('Dialog output:', res);
      this.getOrganizations()

    })
  }
  


}
