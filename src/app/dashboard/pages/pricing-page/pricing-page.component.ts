import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterModule } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css',
})
export class PricingPageComponent implements OnInit {
  planType: number = 1;
  plans: any[] = [];
  planLoading = true;
  planTypes: any[] = [];
  detectorRef = inject(ChangeDetectorRef);
  router = inject(Router)
  service = inject(PlanService);
  selectedInterval: string = 'month';

  ngOnInit(): void {
    this.planLoading = true;
    this.service.getStipePlans().subscribe(
      (plans) => {

        this.planTypes = plans.plans;
        this.planLoading = true;
        this.detectorRef.detectChanges();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  toggleInterval(interval: string) {
    this.selectedInterval = interval;
  }

  navigateToPlan(buttonLink: string, queryParams: any, planId: string): void {
    // Add the plan ID to the query parameters
    console.log(buttonLink);
    console.log(queryParams);
    console.log(planId);
    
    const updatedQueryParams = { ...queryParams, planId };
    this.router.navigate([buttonLink], { queryParams: updatedQueryParams });
  }

  navigateToTrial(trialLink: string, trialQueryParams: any, planId: string): void {
    // Add the plan ID to the query parameters
    console.log(trialLink);
    console.log(trialQueryParams);
    console.log(planId);
    const updatedQueryParams = { ...trialQueryParams, planId };
    this.router.navigate([trialLink], { queryParams: updatedQueryParams });
  }
}
