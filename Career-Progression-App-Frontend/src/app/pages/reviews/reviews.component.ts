import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService, UserDTO } from '../../services/task.service';
import { Task, TaskStatus } from '../../model/task.model';
import { getStatusIcon, formatTaskStatus } from '../../utils/task.utils';
import { ReviewTaskDialogComponent } from './review-task-dialog/review-task-dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule
  ]
})
export class ReviewsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'assignedToName', 'createdAt', 'status', 'actions'];
  dataSource: Task[] = [];
  loading = false;
  users: UserDTO[] = [];
  selectedUser: number | null = null;
  searchQuery = '';
  private searchSubject = new Subject<string>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Task>;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.loadTasks();
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers(): void {
    this.taskService.getUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
      }
    );
  }

  loadTasks(): void {
    this.loading = true;
    const params = {
      userId: this.selectedUser || undefined,
      searchQuery: this.searchQuery || undefined
    };

    const token = localStorage.getItem('token');
    let teamLeadId: number | undefined = undefined;
    if (token) {
      const decoded: any = jwtDecode(token);
      teamLeadId = decoded.user_id;
    }

    if (!teamLeadId) {
      this.snackBar.open('User ID not found', 'Close', { duration: 3000 });
      this.loading = false;
      return;
    }

    this.taskService.getTasksInReview(teamLeadId, params).subscribe(
      response => {
        this.dataSource = response.data.data;
        this.loading = false;
      },
      error => {
        this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onUserFilterChange(userId: number | null): void {
    this.selectedUser = userId;
    this.loadTasks();
  }

  openReviewDialog(task: Task): void {
    const dialogRef = this.dialog.open(ReviewTaskDialogComponent, {
      width: '600px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  getStatusIcon = getStatusIcon;
  formatTaskStatus = formatTaskStatus;
}
