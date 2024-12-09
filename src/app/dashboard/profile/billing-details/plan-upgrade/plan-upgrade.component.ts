import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PlanService } from '../../../../services/plan.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'; // Import PayPal config
import { AuthService } from '../../../../services/auth.service'; // Import AuthService for user data
import { MatSnackBar } from '@angular/material/snack-bar'; // Snackbar for success/error messages
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-plan-upgrade',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './plan-upgrade.component.html',
  styleUrls: ['./plan-upgrade.component.css']
})
export class PlanUpgradeComponent implements OnInit {


  planLoading: boolean = true;
  private readonly service = inject(PlanService);
  private readonly detectorRef = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);

  planTypes: any;
  selectedInterval: string = 'month';
  selectedPlan: any;
  public payPalConfig?: IPayPalConfig;
  public userId!: string;
  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;

  constructor() {
    this.planLoading = true;
    this.authService.userProfile$.subscribe({
      next: (response) => {
        const user = response.user
        this.userId = user._id
        console.log(
          this.userId
        )

      }
    })
    this.service.getPlans().subscribe(
      (plans) => {
        this.planTypes = plans.plans;
        this.planLoading = false;
        this.detectorRef.detectChanges();
      },
      (error) => {
        console.error(error);
        this.planLoading = false;
      }
    );
  }

  ngOnInit(): void {
    // PayPal config will be initialized in `selectPlan`
  }

  toggleInterval(interval: string) {
    this.selectedInterval = interval;
  }

  // Handle plan selection and initialize PayPal configuration
  selectPlan(plan: any): void {
    this.selectedPlan = plan;
    this.initPayPalConfig();
  }

  // Initialize PayPal configuration dynamically based on the selected plan
  private initPayPalConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AXBL_2Bz7P3ArXfpL-gwlNjeXwz38eiNCrvTfrUA5efGicHbISs-ZHAW7c3q7iNzwQAFxD3HQczoXIKA', // Your PayPal client ID
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.selectedPlan.amount,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.selectedPlan.amount,
                  },
                },
              },
              items: [
                {
                  name: this.selectedPlan.title,
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.selectedPlan.amount,
                  },
                },
              ],
            },
          ],
          billing_cycles: [
            {
              frequency: {
                interval_unit: this.selectedPlan.interval,
                interval_count: 1, // Monthly or other billing cycle interval
              },
              tenure_type: 'REGULAR',
              sequence: 1,
              total_cycles: 0,
              pricing_scheme: {
                fixed_price: {
                  value: this.selectedPlan.amount,
                  currency_code: 'USD',
                },
              },
            },
          ]
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          this.createSubscription(details);
        });
      },
      onClientAuthorization: () => {
        this.showSuccess = true;
      },
      onCancel: () => {
        this.showCancel = true;
      },
      onError: (err) => {
        this.showError = true;
        console.error('PayPal error:', err);
      },
      onClick: () => this.resetStatus(),
    };
  }

  // Reset status flags
  private resetStatus(): void {
    this.showSuccess = false;
    this.showCancel = false;
    this.showError = false;
  }

  // Handle subscription creation after PayPal order approval
  createSubscription(orderDetails: any): void {
    const subscriptionData = {
      userId: this.userId,
      plan: this.selectedPlan, // You could also store the plan ID
      paypalOrderId: orderDetails.id,
    };

    this.service.createPlan(subscriptionData).subscribe({
      next: (response: any) => {
        this.snackbar.open(
          'Your subscription has been upgraded successfully!',
          'Close',
          { duration: 3000 }
        );
        // Handle additional actions after successful subscription creation
      },
      error: (error: any) => {
        console.error('Error creating subscription:', error);
        this.snackbar.open(
          'Error upgrading subscription. Please try again later.',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}
