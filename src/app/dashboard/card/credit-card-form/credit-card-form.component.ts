import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardService } from '../../../services/card.service';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TagsCreationDialogComponent } from '../../../common/tags-creation-dialog/tags-creation-dialog.component';
import { FolderService } from '../../../services/folder.service';
import { map } from 'rxjs';
import moment, { Moment } from 'moment';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter'; // Moment.js date adapter

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] }, // Use MomentDateAdapter for moment.js
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Provide custom date formats
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Set locale
  ],
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.css'] // Corrected to `styleUrls`
})
export class CreditCardFormComponent {
  creditCardForm: FormGroup;
  private readonly fb = inject(FormBuilder);
  private readonly cardService = inject(CardService);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly folderService = inject(FolderService);
  selectedTags: any[]=[];
  tags: any[] = [];
  isLoading: boolean = false;
  folders: any[]=[];

  constructor() {
    this.creditCardForm = this.fb.group({
      cardType: [''],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: [null, Validators.required],
      CVV: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      billingAddress: ['', Validators.required],
      tags: new FormControl([]),
      folderId: new FormControl('', Validators.required),
      searchTerm: new FormControl(null),
      searchFolders: new FormControl(null),
    });
  }
  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    const tags = this.creditCardForm.value.tags || [];
    tags.push(event.option.value);

    this.creditCardForm.controls['tags'].setValue(tags);
    this.selectedTags = tags;

    this.creditCardForm.controls['searchTerm'].setValue(null);
    event.option.deselect();
    this.changeDetectorRef.detectChanges();
  }


  searchTags(): void {
    const searchTerm = this.creditCardForm.value.searchTerm?.trim().toLowerCase();
    if (searchTerm) {
      this.isLoading = true;
      this.cardService
        .searchTags(searchTerm)
        .pipe(
          map((value: any[]) =>
            value.map((tag: any) => ({ name: tag.name, _id: tag._id }))
          )
        )
        .subscribe({
          next: (tags: any[]) => {
            this.tags = tags;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error searching tags:', error);
            this.isLoading = false;
          },
        });
    } else {
      this.tags = []; // Clear tags if search term is empty
      this.isLoading = false;
    }
  }

  searchFolders(): void {}

  onFolderSelected($event: MatAutocompleteSelectedEvent) {
    this.creditCardForm.get('folderId')?.setValue($event.option.value._id);
    this.creditCardForm.get('searchFolders')?.setValue($event.option.value.label);
  }

  createNewFolder(): void {
    this.folderService
      .createFolder({
        name: this.creditCardForm.value.searchFolders,
        type: 'cards',
      })
      .subscribe({
        next: (folder: any) => {
          this.folders.push(folder);
          this.creditCardForm.get('folderId')?.setValue(folder._id);
          this.creditCardForm.get('searchFolders')?.setValue(folder.name);
          this.changeDetectorRef.detectChanges();
        },
        error: (error: any) => console.error('Error creating folder:', error),
      });
  }

  createNewTag(): void {
    this.dialog.open(TagsCreationDialogComponent, {
      width: '1400px',
    });
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.creditCardForm.get('expiryDate')!.value || moment();
    ctrlValue.month(normalizedMonth.month());
    ctrlValue.year(normalizedMonth.year());
    this.creditCardForm.get('expiryDate')!.setValue(ctrlValue);
    datepicker.close();
  }

  removeTag(tagId: string): void {
    const currentTags = this.creditCardForm.get('tags')?.value || [];
    const updatedTags = currentTags.filter((tag: { _id: string }) => tag._id !== tagId);
    this.creditCardForm.get('tags')?.setValue(updatedTags);
    this.selectedTags = updatedTags;
  }

  onSubmit() {
    if (this.creditCardForm.valid) {
      this.cardService.createCard(this.creditCardForm.value).subscribe(response => {
        console.log('Credit card created', response);
      });
    }
  }
}
