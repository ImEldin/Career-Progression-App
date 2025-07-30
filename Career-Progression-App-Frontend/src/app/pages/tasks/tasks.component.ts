import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TaskService, TaskSearchParams } from '../../services/task.service';
import { Task, TaskStatus } from '../../model/task.model';
import { UserDTO, PositionDTO } from '../../services/task.service';
import { TemplateService, TemplateDTO } from '../../services/template.service';
import { PaginatedResponse } from '../../model/paginated-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getStatusIcon, formatTaskStatus } from '../../utils/task.utils';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
  ],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  selectedUser: UserDTO | null = null;
  selectedTeam: string | null = null;
  selectedPosition: PositionDTO | null = null;
  selectedStatus: TaskStatus | null = null;
  selectedTemplate: TemplateDTO | null = null;
  searchQuery: string = '';
  isAdminOrCto: boolean = false;

  currentPage = 0;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;

  users: UserDTO[] = [];
  teams: string[] = [];
  positions: PositionDTO[] = [];
  templates: TemplateDTO[] = [];
  statuses = Object.values(TaskStatus);

  isUser: boolean = false;

  loading = false;

  getStatusIcon = getStatusIcon;
  formatTaskStatus = formatTaskStatus;

  constructor(
    private taskService: TaskService,
    private templateService: TemplateService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadTasks();
    const role = this.authService.getCurrentUser()?.role;
    this.isUser = role === 'USER';
    this.isAdminOrCto = role === 'ADMIN' || role === 'CTO';
  }

  loadFilterOptions() {
    this.taskService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => console.error('Error loading users:', err),
    });

    this.taskService.getTeams().subscribe({
      next: (teams) => (this.teams = teams),
      error: (err) => console.error('Error loading teams:', err),
    });

    this.taskService.getPositions().subscribe({
      next: (positions) => (this.positions = positions),
      error: (err) => console.error('Error loading positions:', err),
    });

    this.templateService.getTemplates().subscribe({
      next: (templates) => (this.templates = templates),
      error: (err) => console.error('Error loading templates:', err),
    });
  }

  loadTasks() {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    const searchParams: TaskSearchParams = {
      userId: this.selectedUser?.id,
      teamName: this.selectedTeam || undefined,
      positionId: this.selectedPosition?.id,
      status: this.selectedStatus?.toString() || undefined,
      templateId: this.selectedTemplate?.id,
      searchQuery: this.searchQuery || undefined,
      page: this.currentPage,
      size: this.pageSize,
    };

    this.taskService.searchTasks(searchParams).subscribe({
      next: (response) => {
        if (response.success) {
          let allTasks = response.data.data;
          if (currentUser?.role === 'USER') {
            allTasks = allTasks.filter(
              (task) => task.assignedToId === currentUser.id
            );
          }
          this.tasks = allTasks;
          this.filteredTasks = allTasks;
          if (this.isUser) {
            this.totalItems = allTasks.length;
            this.totalPages = Math.ceil(allTasks.length / this.pageSize);
          } else {
            this.totalItems = response.data.totalCount;
            this.totalPages = response.data.totalPages;
          }

          this.loading = false;
        } else {
          console.error('Error loading tasks:', response.message);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTasks();
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadTasks();
  }

  clearFilters() {
    this.selectedUser = null;
    this.selectedTeam = null;
    this.selectedPosition = null;
    this.selectedStatus = null;
    this.selectedTemplate = null;
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadTasks();
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return '#C5E5E3';
      case TaskStatus.IN_PROGRESS:
        return '#F0F1B3';
      case TaskStatus.IN_REVIEW:
        return '#A3A7E4';
      case TaskStatus.DONE:
        return '#BAE2BE';
      default:
        return '#6B7280';
    }
  }

  createTask() {
    this.router.navigate(['/task-create']);
  }

  editTask(task: Task) {
    this.router.navigate(['/task-edit'], { queryParams: { taskId: task.id } });
  }

  deleteTask(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete the task "${task.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Task deleted successfully', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
              this.loadTasks();
            } else {
              this.snackBar.open(
                response.message || 'Error deleting task',
                'Close',
                {
                  duration: 5000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                }
              );
            }
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            this.snackBar.open('Error deleting task', 'Close', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  viewTask(task: Task) {
    this.router.navigate(['/task', task.id]);
  }
}
