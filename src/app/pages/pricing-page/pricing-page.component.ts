import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [ MatButtonModule, MatRadioModule, FormsModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css'
})
export class PricingPageComponent {
  planType: number = 1;
  planTypes =  [
      {
        id:1,
        title: 'Free Plan',
        price: '$0/month',
        features: [
          { icon: '🔒', text: 'Secure Data Sharing' },
          { icon: '💾', text: '500 MB Storage' },
          { icon: '📦', text: 'Basic Notes' },
          { icon: '👥', text: '1 Organization' },
          { icon: '📧', text: '5 User Invitations' },
          { icon: '🔑', text: '5 Password Shares' }
        ],
        buttonLink:"/auth/signup",
        buttonText: 'Get Started'
      },
      {
        id:2,
        title: 'Basic Plan',
        price: '$5/month',
        features: [
          { icon: '🔒', text: 'Enhanced Secure Data Sharing' },
          { icon: '💾', text: '1 GB Storage' },
          { icon: '📦', text: 'Advanced Notes' },
          { icon: '👥', text: '2 Organizations' },
          { icon: '📧', text: '15 User Invitations' },
          { icon: '🔑', text: '15 Password Shares' }
        ],
        buttonLink:"/auth/signup",
        buttonText: 'Get Started'
      },
      {
        id:3,
        title: 'Premium Plan',
        price: '$10/month',
        features: [
          { icon: '🔒', text: 'Premium Secure Data Sharing' },
          { icon: '💾', text: '2 GB Storage' },
          { icon: '📦', text: 'Premium Notes' },
          { icon: '👥', text: '5 Organizations' },
          { icon: '📧', text: '50 User Invitations' },
          { icon: '🔑', text: '50 Password Shares' },
          { icon: '🔑', text: 'Emergency Access' }
        ],
        buttonLink:"/auth/signup",
        buttonText: 'Get Started'
      },
      {
        id:5,
        title: 'Teams Plan',
        price: '$4/user/month',
        features: [
          { icon: '🔒', text: 'Secure Data Sharing' },
          { icon: '💾', text: '5 GB Storage' },
          { icon: '📦', text: 'Advanced Notes' },
          { icon: '👥', text: '10 Organizations' },
          { icon: '📧', text: '100 User Invitations' },
          { icon: '🔑', text: '100 Password Shares' },
          { icon: '📜', text: 'Event Log Monitoring' },
          { icon: '🔗', text: 'Directory Integration' },
          { icon: '🔑', text: 'API Access' }
        ],
        buttonLink:"/auth/signup",
        buttonText: 'Start a Trial'
      },
      {
        id:6,
        title: 'Enterprise Plan',
        price: '$6/user/month',
        features: [
          { icon: '🔒', text: 'Enterprise Policies' },
          { icon: '🔐', text: 'Passwordless SSO Integration' },
          { icon: '🔄', text: 'Account Recovery Administration' },
          { icon: '⚙️', text: 'Self-host Option' },
          { icon: '🎁', text: 'Free Families Plan for All Users' },
          { icon: '🔑', text: 'Enhanced Secure Data Sharing' },
          { icon: '💾', text: '10 GB Storage' },
          { icon: '📦', text: 'Premium Notes' },
          { icon: '👥', text: 'Unlimited Organizations' },
          { icon: '📧', text: 'Unlimited User Invitations' },
          { icon: '🔑', text: 'Unlimited Password Shares' },
          { icon: '📜', text: 'Event Log Monitoring' },
          { icon: '🔗', text: 'Directory Integration' },
          { icon: '🔑', text: 'API Access' },
          { icon: '🔄', text: 'Custom Roles' }
        ],
        buttonLink:"/auth/signup",
        buttonText: 'Start a Trial'
      }
    ];

}
