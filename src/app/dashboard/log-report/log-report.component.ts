import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { LogService } from '../../services/log.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',  // Format for parsing date from the input
  },
  display: {
    dateInput: 'MM/DD/YYYY',  // Format for displaying the date
    monthYearLabel: 'MMM YYYY',  // Format for the month/year picker
    dateA11yLabel: 'LL', // Accessibility label
    monthYearA11yLabel: 'MMMM YYYY', // Accessibility label
  },
};

@Component({
  selector: 'app-log-report',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter(),
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, //
  ],
  templateUrl: './log-report.component.html',
  styleUrl: './log-report.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogReportComponent {
  searchTerm: any;
  logs: any[] = [];
  displayedColumns: string[] = [
    'id',
    'action',
    'timestamp',
    'user',
    'ipAddress',
    'type',
    'userAgent',
  ];
  pageSize: number = 10;
  currentPage: number = 0;
  form!: FormGroup;
  mode: MatDrawerMode = 'side';
  isOpened = true;
  isSidebarOpen: boolean = true;
  entities = [
    'all',
    'passwords',
    'folder',
    'tag',
    'file',
    'notes',
    'cards',
    'address',
    'secrets',
    'proofId',
  ]; // predefined entities
  actions = ['all', 'create', 'update', 'delete', 'view', 'share', 'access']; // predefined log statuses
  private searchSubject = new Subject<string>(); // RxJS Subject for search terms

  constructor(
    private logService: LogService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      searchTerm: [''],
      entity: ['all'], // Entity filter
      action: ['all'],
      dateRangeType: [''],
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
    this.getLogsReport();
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.form.get('searchTerm')?.setValue(searchTerm);
      this.getLogsReport(); // Call the API or logic with the search term
    });
  }

  getLogsReport(): void {
    this.logService.getLogs(this.form.value).subscribe({
      next: (logs) => {
        this.logs = logs.logs;

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // Handle the selection change
  change(paramsType: string) {
    this.getLogsReport();
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
  }
  searchLogs(searchTerm: string): void {
    this.searchSubject.next(searchTerm); // Push the term to the RxJS Subject
  }

  onDateRangeChange(value: string): void {
    const today = dayjs(); // Use dayjs to manage today's date
    let start: dayjs.Dayjs | null = null;
    let end: dayjs.Dayjs | null = null;
    // Set the selected value
    this.form.get('dateRangeType')?.setValue(value);

    switch (value) {
      case 'today':
        start = today.startOf('day')
        end = today.endOf('day'); // Use UTC time
        break;
      case 'yesterday':
        start = end = today.subtract(1, 'day');
        break;
      case 'lastWeek':
        start = today.subtract(7, 'days').startOf('day');
        end = today.subtract(7, 'days').endOf('day');
        break;
      case 'last7Days':
        start = today.subtract(6, 'days').startOf('day');
        end = today.endOf('day');
        break;
      case 'lastMonth':
        start = today.subtract(1, 'month').startOf('day');
        end = today.subtract(1, 'month').endOf('day');
        break;
      case 'last30Days':
        start = today.subtract(30, 'days');
        end = today.endOf('day');
        break;
      case 'custom':
      default:
        start = end = null;
        break;
    }


    // Patch values to the form
    this.form.patchValue({
      start: start ? start.utc().format('YYYY-MM-DD HH:mm:ss') : null,
      end: end ? end.utc().format('YYYY-MM-DD HH:mm:ss') : null,
    });

    // If date range is not custom, trigger your report function
    if (this.form.get('dateRangeType')?.value !== 'custom') {
      this.getLogsReport();
    }
  }

  onDateRangeSelectionChange(event: any, type: string) {
    if (this.form.value.start && this.form.value.end) {
      const start = dayjs(this.form.value.start);
      const end = dayjs(this.form.value.end);
      if (start.isAfter(end)) {
        this.form.get('start')?.setValue(null);
        this.form.get('end')?.setValue(null);
        this.form.get('dateRangeType')?.setValue('custom');
        this.form.get('dateRangeType')?.updateValueAndValidity();
      }
      else {
        let start = dayjs(this.form.value.start).utc().format('YYYY-MM-DD HH:mm:ss')
        let end = dayjs(this.form.value.end).utc().format('YYYY-MM-DD HH:mm:ss')
        console.log('start', start, end);

        this.form.patchValue({
          start: start ? start : null,
          end: end ? end : null,
        });
        this.form.updateValueAndValidity();
        this.getLogsReport();
      }
    }
  }
}
