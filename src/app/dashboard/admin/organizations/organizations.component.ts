import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrganizationComponent } from './organization/organization.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { PlanService } from '../../../services/plan.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatDialogModule, MatButtonModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css'
})
export class OrganizationsComponent implements OnInit {
  organizations: any[] = [];
  displayedColumns: string[] = ['_id', 'name', 'description', 'ownerName', 'ownerEmail', 'createdAt', 'updatedAt'];
  planDetails: any = null;
  hideButton: boolean = false;
  constructor(
    private readonly organizationsService: OrganizationService,
    private readonly dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly authService: AuthService,
    private planService: PlanService

  ) { }

  ngOnInit(): void {
    this.getOrganizations();
    this.authService.userProfile$.subscribe({
      next: (user) => {

        this.planDetails = this.planService.planDetails.find((plan) => {
          return plan.plan === user.planDetails.plan;
        })
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  getOrganizations(): void {
    this.organizationsService.getOrganizations().subscribe((organizations: any) => {
      console.log(this.planDetails)
      this.organizations = organizations;
      this.hideButton = this.planDetails.features.organization === organizations.length


      this.changeDetectorRef.detectChanges();
    });
  }
  openOrganizationDialog(): void {
    const dialogRef = this.dialog.open(OrganizationComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog output:', res);
      this.getOrganizations()

    })
  }



}
