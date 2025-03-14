import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing-details',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, MatExpansionModule,
    CommonModule
  ],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.css'
})
export class BillingDetailsComponent implements OnInit {
  readonly commonService = inject(CommonService)
  private readonly authService = inject(AuthService);
  planDetails: any = {
    id: 'null',
    title: 'Free Plan',
    amount: 0,
    currency: 'USD',
    interval: 'month',
    intervalCount: 1,
    features: [
      {
        icon: '💾',
        text: '500 MB Storage',
        _id: '66edb1f317812bd55ad87b4b',
      },
      {
        icon: '📦',
        text: 'Store passwords, notes, cards, ID proofs',
        _id: '66edb1f317812bd55ad87b4c',
      },
      {
        icon: '👥',
        text: '1 Organization',
        _id: '66edb1f317812bd55ad87b4d',
      },
      {
        icon: '📧',
        text: '5 User Invitations',
        _id: '66edb1f317812bd55ad87b4e',
      },
      {
        icon: '🔑',
        text: '5 Shares',
        _id: '66edb1f317812bd55ad87b4f',
      },
    ],
    buttonLink: '/auth/signup',
    buttonText: 'Get Started',
    hasTrial: false,
    queryParams: {
      plan: 'free',
      action: 'signup',
    },
  };
  constructor() { }
  ngOnInit(): void {
    this.authService.userProfile$.subscribe({
      next: (user) => {
        if (user.planDetails) {
          this.planDetails = user.planDetails;
        }
        console.log(
          this.planDetails
        );
      },
      error: (error) => {
        console.error('Error in fetching your plan details, e:', error.message);

      }
    })
  }

  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
}
