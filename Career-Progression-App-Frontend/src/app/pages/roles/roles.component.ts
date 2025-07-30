import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { CreateRoleService, RoleDTO } from '../roles/create-role.service';
import { MatButtonModule } from '@angular/material/button';
import { NgZone } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  roles: RoleDTO[] = [];
  expandedRoles: boolean[] = [];
  loading: boolean = false;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private roleService: CreateRoleService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadRoles();
    this.expandedRoles = this.roles.map(() => false);
  }

  toggleRole(index: number): void {
    this.expandedRoles[index] = !this.expandedRoles[index];
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (data) => ((this.roles = data), (this.loading = false)),
      error: (err) => {
        console.error('Error loading roles:', err);
      },
    });
  }

  openRoleDialog(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Role created:', result);
        this.snackBar.open('Role created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.loadRoles();
      }
    });
  }

  editRole(role: RoleDTO): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '700px',
      data: role,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Role updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.loadRoles();
      }
    });
  }

  deleteRole(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete the role: ${name}?`)) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.roles = this.roles.filter((role) => role.id !== id);
            this.snackBar.open('Role deleted.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            console.error('Delete failed', err);
            this.snackBar.open('Failed to delete role.', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          });
        },
      });
    }
  }

  getPermissionDescription(permissionName: string): string {
    return (
      PERMISSION_DESCRIPTIONS[permissionName] || 'No description available'
    );
  }
}
