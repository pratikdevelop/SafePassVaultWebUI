import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatButtonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  readonly router = inject(Router);
  readonly activate = inject(ActivatedRoute);
  readonly token = localStorage.getItem('token');

  ngOnInit(): void {    
    if (!this.token && environment.isElectron) {
      this.router.navigateByUrl('/auth/login');
    } else if (this.token) {
      this.router.navigateByUrl('/dashboard/passwords');
    }
  }
}
