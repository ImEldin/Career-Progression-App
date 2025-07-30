import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../model/task.model';
import { getStatusIcon, formatTaskStatus } from '../../utils/task.utils';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatExpansionModule,
  ],
})
export class TaskViewComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  navigating = false;
  checkingAccess = false;
  getStatusIcon = getStatusIcon;
  formatTaskStatus = formatTaskStatus;
  canManageTasks = false;
  canInteractWithTasks = false;
  templateDetails: SafeHtml | null = null;
  templateRequirements: SafeHtml | null = null;
  showTemplateDetails = false;
  loadingTemplateDetails = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loadTask(+params['id']);
      } else {
        this.snackBar.open('Invalid task ID', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private checkPermissions(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.permissions) {
      this.canManageTasks = user.permissions.includes('MANAGE_TASK');
      this.canInteractWithTasks =
        user.permissions.includes('INTERACT_WITH_TASK');
    }

    if (!this.canInteractWithTasks) {
      this.snackBar.open(
        'You do not have permission to view task details.',
        'Close',
        {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }
      );
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.task = task;
        this.checkTaskAccess(task);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        let errorMessage = 'Error loading task. Please try again.';

        if (error.status === 403) {
          errorMessage = 'You do not have permission to view this task.';
        } else if (error.status === 404) {
          errorMessage = 'Task not found.';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
    });
  }

  private checkTaskAccess(task: Task): void {
    this.checkingAccess = true;
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.canManageTasks) {
      this.checkingAccess = false;
      return;
    }

    if (this.canInteractWithTasks && task.assignedToId === currentUser.id) {
      this.checkingAccess = false;
      return;
    }

    this.snackBar.open(
      'You do not have permission to view this task.',
      'Close',
      {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );
    this.router.navigate(['/dashboard']);
    this.checkingAccess = false;
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO:
        return '#6366F1'; // Indigo
      case TaskStatus.IN_PROGRESS:
        return '#F59E0B'; // Amber
      case TaskStatus.IN_REVIEW:
        return '#8B5CF6'; // Purple
      case TaskStatus.DONE:
        return '#10B981'; // Emerald
      default:
        return '#6B7280'; // Gray
    }
  }

  navigateToTasks(): void {
    if (this.navigating) return;
    this.navigating = true;
    this.router.navigate(['/tasks']).finally(() => {
      this.navigating = false;
    });
  }

  navigateToDashboard(): void {
    if (this.navigating) return;
    this.navigating = true;
    this.router.navigate(['/dashboard']).finally(() => {
      this.navigating = false;
    });
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/task-edit'], {
        queryParams: { taskId: this.task.id },
      });
    }
  }

  async formatTemplateDetails(details: string): Promise<SafeHtml> {
    if (!details) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    const markedDetails = await marked(details);
    return this.sanitizer.bypassSecurityTrustHtml(markedDetails);
  }

  async renderTemplateDetails(): Promise<void> {
    if (this.task?.templateId) {
      this.loadingTemplateDetails = true;
      try {
        const template = await this.ticketService
          .getTicketById(this.task.templateId)
          .toPromise();
        if (template) {
          this.templateDetails = await this.formatTemplateDetails(
            template.description
          );
          this.templateRequirements = await this.formatTemplateDetails(
            template.requirements
          );
        } else {
          this.snackBar.open('Template not found', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      } catch (error: any) {
        console.error('Error loading template details:', error);
        let errorMessage = 'Error loading template details';

        if (error?.status === 404) {
          errorMessage = 'Template not found';
        } else if (error?.status === 403) {
          errorMessage = 'You do not have permission to view this template';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } finally {
        this.loadingTemplateDetails = false;
      }
    }
  }

  toggleTemplateDetails(): void {
    this.showTemplateDetails = !this.showTemplateDetails;
    if (this.showTemplateDetails && !this.templateDetails) {
      this.renderTemplateDetails();
    }
  }
}
