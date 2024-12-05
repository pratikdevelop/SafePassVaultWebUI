import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { LogService } from '../../services/log.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-report',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatDividerModule, MatListModule, MatSidenavModule, MatIconModule, MatSelectModule, MatOptionModule, CommonModule],
  templateUrl: './log-report.component.html',
  styleUrl: './log-report.component.css'
})
export class LogReportComponent {
  searchTerm: any;
  searchLogs() {
    throw new Error('Method not implemented.');
  }
  logs: any[] = [];
  filter = { action: '', status: '' };
  displayedColumns: string[] = ['action', 'timestamp', 'user', 'status', 'ipAddress', 'type'];
  pageSize: number = 5;
  currentPage: number = 0;
  form!: FormGroup;
  mode: MatDrawerMode = 'side';
  isOpened = true;
  isSidebarOpen: boolean = true;
  entities = ['passwords', 'folders', 'tags', 'files', 'notes', 'cards', 'address', 'secrets']; // predefined entities
  actions = ['create', 'update', 'delete', 'view', 'share', 'access']; // predefined log statuses
  constructor(private logService: LogService, private changeDetectorRef: ChangeDetectorRef, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      filterList: ['all'], // Default filter to 'all'
      entity: [''], // Entity filter
      status: [''], // Log status filter
      action: [''] // Action filter (create, update, etc.)
    });
    this.logService.getLogs().subscribe({
      next: (logs) => {
        this.logs = logs.logs;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  // Handle the selection change
  change(selectedValue: any) {
    console.log('Selected filter:', selectedValue);
  }

  get filteredLogs() {
    return this.logs
      .filter(log =>
        (this.filter.action ? log.action.toLowerCase().includes(this.filter.action.toLowerCase()) : true) &&
        (this.filter.status ? log.status.toLowerCase().includes(this.filter.status.toLowerCase()) : true)
      )
      .slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
  }
}
