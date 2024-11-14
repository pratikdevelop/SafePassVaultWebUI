import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FilePreview } from '../../../interfaces/file';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  private readonly sanitizer = inject(DomSanitizer)
  sanitizedUrl!: SafeResourceUrl;

  ngOnInit(): void {
    console.log('ff', this.file);
    
  }
  // Function to open the file in a new tab
  openFileInNewTab(url: string) {
    window.open(url, '_blank');
  }

  getSanitizedImageUrl(file: { filename: string; location: string; }) {
    if (file.filename.endsWith('.jpg') || file.filename.endsWith('.png') || file.filename.endsWith('.jpeg')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(file.location);
    }
    return null;
  }

  getSanitizedPdfUrl(file: { filename: string; location: string; }) {
    if (file.filename.endsWith('.pdf')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(file.location);
    }
    return null;
  }
}
