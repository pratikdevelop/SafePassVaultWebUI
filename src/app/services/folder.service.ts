import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';

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

  // BehaviorSubject to manage folder data in real-time
  private folderBehaviourSubject = new BehaviorSubject<Folder[] | null>(null);
  public folderSubject$: Observable<Folder[] | null> = this.folderBehaviourSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Load folders initially and set BehaviorSubject
  loadUserFolders(): void {
    this.getUserFolders().subscribe(folders => this.folderBehaviourSubject.next(folders));
  }

  // Create a new folder and update the BehaviorSubject
  createFolder(folder: Folder): Observable<Folder> {
    return this.http.post<Folder>(this.apiUrl, folder).pipe(
      tap(newFolder => {
        const currentFolders = this.folderBehaviourSubject.value || [];
        this.folderBehaviourSubject.next([...currentFolders, newFolder]);
      })
    );
  }

  // Get all folders for the logged-in user
  getUserFolders(): Observable<Folder[]> {
    return this.http.get<Folder[]>(this.apiUrl);
  }

  // Get folders by type and update BehaviorSubject
  getFoldersByType(type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`).pipe(map(response => {
      console.log(
        'Folders by type response:', response
      );

      const folders = response;
      this.folderBehaviourSubject.next(folders);
      return folders;
    }))
  }

  // Get folder by ID
  getFolderById(folderId: string): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}/${folderId}`);
  }

  // Update a folder and update the BehaviorSubject
  updateFolder(folderId: string, folder: Folder): Observable<Folder> {
    return this.http.put<Folder>(`${this.apiUrl}/${folderId}`, folder).pipe(
      tap(updatedFolder => {
        const currentFolders = this.folderBehaviourSubject.value || [];
        const updatedFolders = currentFolders.map(f =>
          f._id === folderId ? updatedFolder : f
        );
        this.folderBehaviourSubject.next(updatedFolders);
      })
    );
  }

  // Delete a folder and update the BehaviorSubject
  deleteFolder(folderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${folderId}`).pipe(
      tap(() => {
        const currentFolders = this.folderBehaviourSubject.value || [];
        const updatedFolders = currentFolders.filter(f => f._id !== folderId);
        this.folderBehaviourSubject.next(updatedFolders);
      })
    );
  }

  searchFolders(searchTerm: string, type: string): Observable<any> {
    let params = new HttpParams()
      .append('searchTerm', searchTerm).append('type', type)

    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}
