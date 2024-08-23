import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../../services/card.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatSortModule,  MatInputModule, ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  cardSerrvice = inject(CardService)
  
  ngOnInit(): void {
    this.cardSerrvice.getCards().subscribe((response: any)=>{
      console.log(response)
    })
  }


}
