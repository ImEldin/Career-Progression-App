import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Position } from '../../model/position.model';
import { Team } from '../../model/team.model';
import { ApiResponse } from '../../model/api-response.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  positions: Position[] = [];
  teams: Team[] = [];
  displayedColumns: string[] = ['email', 'status', 'actions'];
  isLoading = true;
  activatingUserId: number | null = null;
  deactivatingUserId: number | null = null;
  filterActive: boolean | null = null;
  filterName: string = '';
  selectedPositionIds: number[] = [];
  selectedTeamIds: number[] = [];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadPositions();
    this.loadTeams();
  }

  loadPositions(): void {
    this.userService.getPositions().subscribe({
      next: (positions) => {
        this.positions = positions;
      },
      error: (err) => {
        this.snackBar.open('Failed to load positions', 'Dismiss', { duration: 3000 });
      }
    });
  }

  loadTeams(): void {
    this.userService.getTeams().subscribe({
      next: (teams) => {
        console.log('Loaded teams:', teams);
        this.teams = teams;
      },
      error: (err) => {
        this.snackBar.open('Failed to load teams', 'Dismiss', { duration: 3000 });
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    const filterParams = {
      active: this.filterActive ?? undefined,
      name: this.filterName || undefined,
      positionIds: this.selectedPositionIds,
      teamIds: this.selectedTeamIds
    };

    this.userService.filterUsers(filterParams).subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.snackBar.open('Failed to load users', 'Dismiss', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  activateUser(userId: number): void {
    this.activatingUserId = userId;
    this.userService.activateUser(userId).subscribe({
      next: (response: ApiResponse<User>) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.loadUsers();
        this.activatingUserId = null;
      },
      error: (err: any) => {
        this.snackBar.open('Failed to activate user', 'Dismiss', { duration: 3000 });
        this.activatingUserId = null;
      }
    });
  }

  deactivateUser(userId: number): void {
    this.deactivatingUserId = userId;
    this.userService.deactivateUser(userId).subscribe({
      next: (response: ApiResponse<User>) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.loadUsers();
        this.deactivatingUserId = null;
      },
      error: (err: any) => {
        this.snackBar.open('Failed to deactivate user', 'Dismiss', { duration: 3000 });
        this.deactivatingUserId = null;
      }
    });
  }

  refreshList(): void {
    this.loadUsers();
  }

  applyFilters(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.filterActive = null;
    this.filterName = '';
    this.selectedPositionIds = [];
    this.selectedTeamIds = [];
    this.loadUsers();
  }
}
