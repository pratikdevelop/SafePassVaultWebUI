

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// Define the Folder model
export interface Folder {
  _id?: string;
  user?: string;
  name?: string;
  isSpecial?: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = `${environment.api_url}/folders`; // Adjust your API URL as needed

  constructor(private http: HttpClient) {}

  // Create a new folder
  createFolder(folder: Folder): Observable<Folder> {
    return this.http.post<Folder>(this.apiUrl, folder);
  }

  // Get all folders for the logged-in user
  getUserFolders(): Observable<Folder[]> {
    return this.http.get<Folder[]>(this.apiUrl);
  }

  // Get folders by type
  getFoldersByType(type?: string): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${this.apiUrl}/type/${type}`);
  }

  // Get folder by ID
  getFolderById(folderId: string): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}/${folderId}`);
  }

  // Update a folder
  updateFolder(folderId: string, folder: Folder): Observable<Folder> {
    return this.http.put<Folder>(`${this.apiUrl}/${folderId}`, folder);
  }

  // Delete a folder
  deleteFolder(folderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${folderId}`);
  }

}
