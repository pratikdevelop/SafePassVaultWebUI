import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService {
  private rolesPermissions = new BehaviorSubject({
    admin: {
      // Existing permissions
      sharePassword: true,
      createPassword: true,
      totp: true,
      storeFiles: true,
      notes: true,
      cardDetails: true,
      proofID: true,
      createOrganization: true,
      addUser: true,
      inviteUser: true,
      deleteUser: true,
      enableMFA: true,
      // New permissions
      export: true,
      import: true,
      viewPassword: true,
      editPassword: true,
      deletePassword: true,
      viewFile: true,
      editFile: true,
      deleteFile: true,
      viewNote: true,
      editNote: true,
      deleteNote: true,
      viewCard: true,
      editCard: true,
      deleteCard: true,
      viewProofID: true,
      editProofID: true,
      deleteProofID: true,
      createTag: true,
      deleteTag: true,
      viewComment: true,
      addComment: true,
      deleteComment: true,
    },
    user: {
      // Existing permissions
      sharePassword: false,
      createPassword: false,
      totp: false,
      storeFiles: false,
      notes: false,
      cardDetails: false,
      proofID: false,
      viewOrganization: false,
      inviteUser: false,
      enableMFA: false,
      // New permissions
      viewPassword: false,
      viewFile: false,
      viewNote: false,
      viewCard: false,
      viewProofID: false,
      viewComment: false,
      addComment: false
    }
  });

  getRolesPermissions() {
    return this.rolesPermissions.asObservable();
  }

  updateRolePermissions(role: string, permissions: any) {
    const currentPermissions: any = this.rolesPermissions.getValue();
    this.rolesPermissions.next({
      ...currentPermissions,
      [role]: { ...currentPermissions[role], ...permissions }
    });
  }
}
