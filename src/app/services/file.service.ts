import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.api_url}/files`; // Replace with your API URL

  constructor(private http: HttpClient) { }


  // Fetch files and folders
  getFilesAndFolders(folderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Create a new folder
  createFolder(name: string, parentId = null): Observable<any> {
    return this.http.post(`${this.apiUrl}/folder`, { name, parentId });
  }

  removeFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/file/${fileId}`);
  }
  // Create a new folder
  searchUsers(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/searchUsers/${name}`);
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`);
  }

  // Upload a file
  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  updateFileMetadata(fileId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${fileId}`, updatedData);
  }

  // Share a file or folder
  shareItem(itemId: string, shareWith: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/share/${itemId}`, { shareWith });
  }

  // File preview
  getFilePreview(fileId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/preview/${fileId}`);
  }
}
