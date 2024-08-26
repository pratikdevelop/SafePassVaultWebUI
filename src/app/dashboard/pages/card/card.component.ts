import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../../services/card.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreditCardFormComponent } from '../dialog/credit-card-form/credit-card-form.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatSortModule,MatDialogModule,MatButtonModule, MatIconModule,  MatInputModule,MatPaginatorModule, CommonModule, MatMenuModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  matDialog = inject(MatDialog)
  changeDetectorRef = inject(ChangeDetectorRef)
  cardSerrvice = inject(CardService)
  displayedColumns: string[] = ['_id', 'cardType', 'cardNumber', 'cardHolderName', 'expiryDate', 'CVV', 'billingAddress', 'createdAt',
    'created_by', 'action'
  ];
  dataSource: any[] = [];

  
  ngOnInit(): void {
    this.cardSerrvice.getCards().subscribe((response: any)=>{
      this.dataSource = response
      this.changeDetectorRef.detectChanges()
    })
  }

  setFilter(arg0: string) {
    throw new Error('Method not implemented.');
    }
    performAction(arg0: string) {
    throw new Error('Method not implemented.');
    }
    openCardFormDialog(card: any) {
      this.matDialog.open(CreditCardFormComponent, {
        width: '500px',
        data: card
        });
    }
    deleteCard(arg0: any) {
    throw new Error('Method not implemented.');
    }
    shareCard(arg0: any) {
    throw new Error('Method not implemented.');
    }
    viewCard(arg0: any) {
    throw new Error('Method not implemented.');
    }
    


}
