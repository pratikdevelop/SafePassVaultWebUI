import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError, tap } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { HeaderComponent } from "../../common/header/header.component";
import { SideNavComponent } from "../../common/side-nav/side-nav.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ViewChild } from '@angular/core';
import {
  MatDrawer,
  MatDrawerMode
} from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    MatCheckboxModule,
    MatMenuModule,
    FormsModule,
    HeaderComponent,
    SideNavComponent,
    MatSidenavModule,
    MatTooltipModule
],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  readonly matDialog = inject(MatDialog);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly cardSerrvice = inject(CardService);
  readonly commonService = inject(CommonService)
  selection = new SelectionModel<any>(true, []);
  dataSource: any[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = [
    'select',
    'favourites',
    '_id',
    'cardType',
    'cardNumber',
    'cardHolderName',
    'expiryDate',
    'CVV',
    'billingAddress',
    'createdAt',
    'created_by',
    'action',
  ];
folders: any;
@ViewChild('drawer') drawer: MatDrawer | undefined;
readonly dialog = inject(MatDialog);
readonly breakpointObserver = inject(BreakpointObserver);
readonly router = inject(Router);
readonly activateRouter = inject(ActivatedRoute)
readonly service  = inject(FolderService);
mode: MatDrawerMode = 'side';
isSidebarOpen: boolean = true;
isBreakPoint: boolean = false;
isShow: boolean = false;
showCardNumber = false;

toggleCardNumberVisibility(): void {
  this.showCardNumber = !this.showCardNumber;
}

  ngOnInit(): void {
    this.getCardsListings();
    this.breakpointObserver
    .observe(['(max-width: 600px)'])
    .subscribe((result) => {
      if (result.breakpoints['(max-width: 600px)']) {
        this.isBreakPoint = true;
        this.isSidebarOpen = false;
        this.mode = 'over';
      } else {
        this.isSidebarOpen = true;
        this.isBreakPoint = false;
        this.mode = 'side';
      }
    });
    
    this.activateRouter.data.subscribe((response: any) => {
      console.log('resolver data',  response);
      
    })
  this.commonService.sideBarOpen.subscribe((res) => {
    if (this.isBreakPoint) {
      this.isSidebarOpen = res;
    }
  });
  if(this.router.url.includes('profile')) {
    this.isShow = false;
  }else {
    this.isShow = true;
  }
  }

  getCardsListings(): void {
    this.cardSerrvice.getCards().subscribe((response: any) => {
      console.log('ff', response);
      
      this.dataSource = response.cards;
      this.changeDetectorRef.detectChanges();
    });
  }
  openCardFormDialog(card: any) {
    this.matDialog.open(CreditCardFormComponent, {
      width: '500px',
      data: card,
    });
  }

  deleteCard(id?: string): void {
    const ids =
      id ??
      this.selection.selected
        .map((note) => {
          return note._id;
        })
        .join(',');
    // Delete password using an observable
    this.cardSerrvice
      .deleteCard(ids)
      .pipe(
        tap(() => {
          this.getCardsListings();
        }),
        catchError((error: any) => {
          console.error('err', error);
          throw error; // re-throw the error to prevent silent failures
        })
      )
      .subscribe({
        complete: () => {
          this.changeDetectorRef.detectChanges();
        },
      });
  }
  viewCardDetails(cardDetails: any): void {
    this.matDialog.open(viewCardDetailsComponent, {
      data: { cardDetails },
    });
  }

  exportPassword(): void {
    const ids = this.selection.selected
      .map((pass) => {
        return pass._id;
      })
      .join(',');
    this.cardSerrvice.exportCardsASCsv(ids).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passwords.csv';
      a.click();
    });
  }

  updateFavourites(cardId?: string): void {
    const ids =
      cardId ??
      this.selection.selected
        .map((pass) => {
          return pass._id;
        })
        .join(',');
    console.log('id', ids);

    this.cardSerrvice.addToFavorites(ids).subscribe(
      (response) => {
        console.log('Password added to favorites successfully', response);
        this.getCardsListings();
        // Handle success, e.g., update UI
      },
      (error) => {
        console.error('Error adding password to favorites', error);
        // Handle error, e.g., display error message
      }
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row._id + 1
    }`;
  }

  transform(cardNumber: string): string {
    return cardNumber.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
}
toggleSideBar(): void {
    this.commonService.toggleSideBar()
}
}

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card-details.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, MatIconModule],
})
export class viewCardDetailsComponent implements OnInit {
  readonly data = inject<any>(MAT_DIALOG_DATA);
  card: any;
  ngOnInit(): void {
  this.card = this.data.cardDetails  
  }
}
