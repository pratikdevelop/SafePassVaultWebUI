import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FolderService } from './services/folder.service';

export const apiResolver: ResolveFn<any[]> = (route, state) => {
  const service  = inject(FolderService)
  const url = state.url;
  const match = url.match(/\/dashboard\/([^\/]+)/);
  const name = match ? match[1] : '';
  const folders: any[] = [];
  service.getFoldersByType(name).subscribe({
    next: (data) => {
      folders.push(...data);
      console.log('cmlkfvlj');
      
      },
    error:(error)=>{
      console.error(error);
    }
  })

  return folders ;
};


