import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import SwaggerUI, { SwaggerUIBundle } from 'swagger-ui-dist';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-docs.component.html',
  styleUrl: './api-docs.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApiDocsComponent implements OnInit {

  ngOnInit(): void {

  }
}

