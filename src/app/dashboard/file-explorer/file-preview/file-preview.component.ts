import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FilePreview } from '../../../interfaces/file';

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnInit {
  @Input()
  file!: FilePreview;  // Receive the file data from the parent component

  ngOnInit(): void {

  }
  // Function to open the file in a new tab
  openFileInNewTab(url: string) {
    window.open(url, '_blank');
  }
}
