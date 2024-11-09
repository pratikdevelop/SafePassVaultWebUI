import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-billing-details',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatIconModule, RouterModule,     MatExpansionModule,
  ],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.css'
})
export class BillingDetailsComponent {
  readonly commonService = inject(CommonService)
  toggleSideBar(): void {
    this.commonService.toggleProfileSideBar();
  }
}
