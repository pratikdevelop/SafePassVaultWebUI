import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  readonly commonService = inject(CommonService)

  toggleSideBar(): void {
    this.commonService.toggleSideBar();
  }

}
