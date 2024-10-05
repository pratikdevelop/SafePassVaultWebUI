import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  sideBarOpen = new BehaviorSubject<any>(false);
  profileSideBarOpen = new BehaviorSubject<any>(false);

  constructor() { }

  toggleSideBar(): void  {
    this.sideBarOpen.next(!this.sideBarOpen.value);
  }
  toggleProfileSideBar(): void  {
    this.profileSideBarOpen.next(!this.profileSideBarOpen.value);
  }
}
