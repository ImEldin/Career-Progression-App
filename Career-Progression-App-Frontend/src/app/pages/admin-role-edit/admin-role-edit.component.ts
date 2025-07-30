import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../../components/edit-role-dialog/edit-role-dialog.component';
import { CommonModule } from '@angular/common';
import { RolePermissionService } from '../../services/role-permission.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-role-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './admin-role-edit.component.html',
  styleUrl: './admin-role-edit.component.css',
})
export class AdminRoleEditComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];
  isLoading = true;

  filterName = '';
  filterRole: string | null = null;
  roles: string[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private rolePermissionService: RolePermissionService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.roles = this.rolePermissionService.getAllRoleNames();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.users = this.allUsers.filter((user) => {
      const matchesName =
        !this.filterName ||
        user.email.toLowerCase().includes(this.filterName.toLowerCase());
      const matchesRole = !this.filterRole || user.roleName === this.filterRole;
      return matchesName && matchesRole;
    });
  }

  refreshList(): void {
    this.loadUsers();
  }

  openEditRoleDialog(user: User): void {
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      width: '300px',
      data: { currentRole: user.roleName },
    });

    dialogRef.afterClosed().subscribe((selectedRole) => {
      if (selectedRole && selectedRole !== user.roleName) {
        this.userService.updateUserRole(user.id, selectedRole).subscribe(() => {
          this.loadUsers();
        });
      }
    });
  }

  deleteUserRole(user: User): void {
    this.userService.deleteUserRole(user.id).subscribe(() => {
      this.loadUsers();
    });
  }
}
