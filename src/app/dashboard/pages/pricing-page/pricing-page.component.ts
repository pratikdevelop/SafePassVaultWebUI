import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [ MatButtonModule, MatRadioModule, FormsModule, RouterModule, ReactiveFormsModule, CommonModule, MatButtonToggleModule],
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css'
})
export class PricingPageComponent implements OnInit {
  planType: number = 1;
  plans: any[] = []
  planTypes = [
    {
      id: 1,
      title: 'Free Plan',
      price: '$0/month',
      yearlyPrice: '$0/year', // Yearly price for the Free Plan
      features: [
        { icon: '💾', text: '500 MB Storage' },
        { icon: '📦', text: 'Store passwords, notes, cards, ID proofs' },
        { icon: '👥', text: '1 Organization' },
        { icon: '📧', text: '5 User Invitations' },
        { icon: '🔑', text: '5 Shares' }
      ],
      buttonLink: "/auth/signup",
      buttonText: 'Get Started',
      queryParams: { plan: "free" }
    },
    {
      id: 2,
      title: 'Basic Plan',
      price: '$5/month',
      yearlyPrice: '$50/year', // 5 * 12 = 60, typically with a discount
      features: [
        { icon: '💾', text: '1 GB Storage' },
        { icon: '📦', text: 'Store passwords, notes, cards, ID proofs' },
        { icon: '👥', text: '2 Organizations' },
        { icon: '📧', text: '15 User Invitations' },
        { icon: '🔑', text: '15 Shares' }
      ],
      buttonLink: "/auth/signup",
      buttonText: 'Get Started',
      queryParams: { plan: "basic" }
    },
    {
      id: 3,
      title: 'Premium Plan',
      price: '$10/month',
      yearlyPrice: '$100/year', // 10 * 12 = 120, typically with a discount
      features: [
        { icon: '💾', text: '2 GB Storage' },
        { icon: '📦', text: 'Store passwords, notes, cards, ID proofs' },
        { icon: '👥', text: '5 Organizations' },
        { icon: '📧', text: '50 User Invitations' },
        { icon: '🔑', text: '50 Shares' }
      ],
      buttonLink: "/auth/signup",
      buttonText: 'Get Started',
      queryParams: { plan: "premium" }
    },
    {
      id: 5,
      title: 'Teams Plan',
      price: '$4/user/month',
      yearlyPrice: '$40/user/year', // 4 * 12 = 48, typically with a discount
      features: [
        { icon: '💾', text: '5 GB Storage' },
        { icon: '📦', text: 'Store passwords, notes, cards, ID proofs' },
        { icon: '👥', text: '10 Organizations' },
        { icon: '📧', text: '100 User Invitations' },
        { icon: '🔑', text: '100 Shares' }
        // { icon: '📜', text: 'Event Log Monitoring' },
      ],
      buttonLink: "/auth/signup",
      buttonText: 'Start a Trial',
      queryParams: { plan: "teams" }
    },
    {
      id: 6,
      title: 'Enterprise Plan',
      price: '$6/user/month',
      yearlyPrice: '$60/user/year', // 6 * 12 = 72, typically with a discount
      features: [
        { icon: '📦', text: 'Store passwords, notes, cards, ID proofs' },
        { icon: '🔐', text: 'Passwordless SSO Integration' },
        // { icon: '⚙️', text: 'Self-host Option' },
        { icon: '💾', text: '10 GB Storage' },
        { icon: '👥', text: 'Unlimited Organizations' },
        { icon: '📧', text: 'Unlimited User Invitations' },
        { icon: '🔑', text: 'Unlimited Password Shares' }
        // { icon: '📜', text: 'Event Log Monitoring' },
      ],
      buttonLink: "/auth/signup",
      buttonText: 'Start a Trial',
      queryParams: { plan: "enterprise" }
    }
  ];
  isYearly = false;

  ngOnInit(): void {
    this.updatePlans();
  }
  toggleBillingCycle(value: boolean) {
    this.isYearly = value;
    this.updatePlans();
  }

  updatePlans() {
    this.plans = this.planTypes.map((plan:any) => ({
      ...plan,
      price: this.isYearly ? plan.yearlyPrice : plan.price
    }));
  }

}
