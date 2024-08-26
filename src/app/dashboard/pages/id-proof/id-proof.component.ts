import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProofIdService } from '../../../services/proof-id.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdproofformComponent } from '../dialog/idproofform/idproofform.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
export interface IdProof {
  _id: string;
  idType: string;
  idNumber: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  userId: string;
  documentImageUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
@Component({
  selector: 'app-id-proof',
  standalone: true,
  imports:[MatButtonModule, MatIconModule, MatMenuModule, MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule, CommonModule],
  templateUrl: './id-proof.component.html',
  styleUrl: './id-proof.component.css'
})

export class IdProofComponent implements OnInit {
  displayedColumns: string[] = [
    'idType', 
    'idNumber', 
    'issuedBy', 
    'issueDate', 
    'expiryDate', 
    'createdAt',    // Add this column
    'createdBy',    // Add this column
    'actions'
  ];
  dataSource!: MatTableDataSource<IdProof>;
  constructor(private proofIdService: ProofIdService, private cdr: ChangeDetectorRef,
    private dialog: MatDialog)
   { }

openIdProofFormDialog(proof: any) {
  const dialogRef = this.dialog.open(IdproofformComponent, {
    width: '500px',
    data: { proof: proof }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      });
}
performAction(arg0: string) {
throw new Error('Method not implemented.');
}
  idProofService = inject(ProofIdService)
  changeDetetorRef = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.idProofService.getProofIds().subscribe((response: any)=>{
      this.dataSource = new MatTableDataSource(response.proofIds);
      this.changeDetetorRef.detectChanges()
    })
  }
}