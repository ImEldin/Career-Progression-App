import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolePermissionService } from '../../services/role-permission.service';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './edit-role-dialog.component.html',
  styleUrl: './edit-role-dialog.component.css',
})
export class EditRoleDialogComponent implements OnInit {
  roles: string[] = [];
  selectedRole: string;

  constructor(
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentRole: string },
    private rolePermissionService: RolePermissionService
  ) {
    this.selectedRole = data.currentRole;
  }

  ngOnInit(): void {
    this.roles = this.rolePermissionService
      .getAllRoleNames()
      .filter((role) => role !== 'ADMIN');
  }

  confirm(): void {
    this.dialogRef.close(this.selectedRole);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
