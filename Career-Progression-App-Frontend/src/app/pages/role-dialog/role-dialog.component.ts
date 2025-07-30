import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateRoleService } from '../roles/create-role.service';

interface PermissionCheckBox {
  name: string;
  description: string;
  checked: boolean;
}

const PERMISSION_DESCRIPTIONS: { [key: string]: string } = {
  MANAGE_TASK: 'Allows creating, editing, deleting, and assigning tasks',
  INTERACT_WITH_TASK: 'Allows commenting on and marking tasks as completed',
  MANAGE_TEMPLATE: 'Allows creating, editing, and deleting task templates',
  VIEW_TEAM_PROFILES: 'Allows viewing profiles of team members',
  VIEW_ALL_PROFILES: 'Allows viewing all profiles in the company',
  COMMENT_ON_PROFILE: 'Allows leaving comments on user profiles',
  REVIEW_EMPLOYEE: 'Allows evaluating employees and writing reviews',
  APPROVE_PROMOTION: 'Allows approving promotions',
  MANAGE_ROLES: 'Allows creating and editing roles in the system',
  MANAGE_PERMISSIONS: 'Allows assigning and removing permissions to/from roles',
  MANAGE_USERS: 'Allows adding, modifying, and deactivating users',
  MANAGE_TEAMS: 'Allows assigning members to teams and editing teams',
  MANAGE_POSITIONS: 'Allows adding and managing positions and levels',
  MANAGE_REPORTS: 'Allows generating and managing reports',
};

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.css',
})
export class RoleDialogComponent implements OnInit {
  permissionNames: PermissionCheckBox[] = [];
  name: string = '';
  data = inject(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<RoleDialogComponent>,
    private roleService: CreateRoleService
  ) {}

  ngOnInit(): void {
    this.roleService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissionNames = data.map((permission) => ({
          name: permission,
          description: PERMISSION_DESCRIPTIONS[permission] || 'No description available',
          checked: this.data?.permissionNames?.includes(permission) || false,
        }));
      },
      error: (err) => {
      },
    });
    this.name = this.data?.name || '';
  }

  onPermissionToggle(permission: PermissionCheckBox) {
    permission.checked = !permission.checked;
  }

  onSubmit() {
    const payload = {
      name: this.name,
      permissionNames: this.permissionNames
        .filter((permission) => permission.checked)
        .map((permission) => permission.name),
    };

    if(this.data) {
      this.roleService
      .updateRole(this.data.id,payload.name, payload.permissionNames)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(payload);
        },
        error: (err) => {
        },
      });
    }
    else {
    this.roleService
      .createRole(payload.name, payload.permissionNames)
      .subscribe({
        next: (response) => {
          this.dialogRef.close(payload);
        },
        error: (err) => {
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
