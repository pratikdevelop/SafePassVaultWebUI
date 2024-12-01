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
  imports: [MatCardModule, MatButtonModule,MatIconModule, RouterModule, MatExpansionModule,
    CommonModule
  ],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.css'
})
export class BillingDetailsComponent implements OnInit {
  readonly commonService = inject(CommonService)
  private readonly authService = inject(AuthService);
  planDetails: any;
  constructor() { }
  ngOnInit(): void {
    this.authService.userProfile$.subscribe({
      next: (user) => {
        console.log(user);
        this.planDetails  = user.planDetails;
        console.log(
          this.planDetails
        );
        },
        

    })
  }

  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
}
