import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:3000/api/files';

  constructor(private http: HttpClient) {}

  // Fetch files and folders
  getFilesAndFolders(folderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Create a new folder
  createFolder(name: string, parentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/folder`, { name, parentId });
  }

  // Create a new folder
  searchUsers(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/searchUsers/${name}`);
  }

  // Upload a file
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Share a file or folder
  shareItem(itemId: string, shareWith: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/share/${itemId}`, { shareWith });
  }

  // File preview
  getFilePreview(fileId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/preview/${fileId}`, { responseType: 'blob' });
  }
}
