import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RolesPermissionsService } from '../../../services/roles-permissions.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSlideToggleModule, CommonModule, MatButtonModule],
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.css']
})
export class RolesPermissionsComponent implements OnInit {
  rolesForm: FormGroup;
  features = [
    'sharePassword', 'createPassword', 'totp', 'storeFiles', 'notes',
    'cardDetails', 'proofID', 'createOrganization', 'addUser', 'inviteUser',
    'deleteUser', 'enableMFA', 'export', 'import',
    'viewPassword', 'editPassword', 'deletePassword',
    'viewFile', 'editFile', 'deleteFile',
    'viewNote', 'editNote', 'deleteNote',
    'viewCard', 'editCard', 'deleteCard',
    'viewProofID', 'editProofID', 'deleteProofID',
    'createTag', 'deleteTag',
    'viewComment', 'addComment', 'deleteComment'
  ];

  constructor(
    private fb: FormBuilder,
    private rolesPermissionsService: RolesPermissionsService
  ) {
    this.rolesForm = this.fb.group({
      roles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.rolesPermissionsService.getRolesPermissions().subscribe((permissions: any) => {
      this.initializeRoles(permissions);
    });
  }

  get roles(): FormArray {
    return this.rolesForm.get('roles') as FormArray;
  }

  initializeRoles(permissions: any) {
    // Clear existing roles if any
    this.roles.clear();

    // Iterate over roles and initialize FormGroups for each
    Object.keys(permissions).forEach(role => {
      const rolePermissions = permissions[role];
      this.roles.push(this.fb.group({
        roleName: [role],
        permissions: this.createPermissionsForm(rolePermissions)
      }));
    });
  }

  createPermissionsForm(rolePermissions: any): FormGroup {
    const permissions = this.features.reduce((acc, feature) => ({
      ...acc,
      [feature]: [rolePermissions[feature] || false]
    }), {});
    return this.fb.group(permissions);
  }

  onSubmit() {
    if (this.rolesForm.valid) {
      const rolesPermissions = this.rolesForm.value.roles.reduce((acc: any, roleObj: any) => {
        acc[roleObj.roleName] = roleObj.permissions;
        return acc;
      }, {});
      this.rolesPermissionsService.updateRolePermissions('admin', rolesPermissions['admin']);
      this.rolesPermissionsService.updateRolePermissions('user', rolesPermissions['user']);
    }
  }
}
