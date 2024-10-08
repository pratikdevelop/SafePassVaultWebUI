import { Component, OnInit } from '@angular/core';
import SwaggerUI, { SwaggerUIBundle } from 'swagger-ui-dist';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [],
  templateUrl: './api-docs.component.html',
  styleUrl: './api-docs.component.css'
})
export class ApiDocsComponent implements OnInit {

  constructor() { 
  }

  ngOnInit(): void {
    this.loadSwaggerUI(); 
    
  }
  
  loadSwaggerUI() {
    const ui = SwaggerUI.SwaggerUIBundle({
      url: 'swagger.json', // Replace with your Swagger JSON URL
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUI.SwaggerUIBundle['presets'].apis,
        SwaggerUI.SwaggerUIBundle['SwaggerUIStandalonePreset']
      ],
     
      plugins: [
        SwaggerUI.SwaggerUIBundle['plugins'].DownloadUrl
      ],
    });

  }
}
