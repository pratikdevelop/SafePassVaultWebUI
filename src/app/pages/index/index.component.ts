import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  router = inject(Router);
  activate = inject(ActivatedRoute);
  token = localStorage.getItem('token');

  ngOnInit(): void {
    console.log('ff', environment);
    
    if (!this.token && environment.isElectron) {
      this.router.navigateByUrl('/auth/login');
    } else if (this.token) {
      this.router.navigateByUrl('/dashboard/passwords');
    }
  }
}
