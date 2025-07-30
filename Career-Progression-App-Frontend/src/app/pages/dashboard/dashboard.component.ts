import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserPositionService } from '../../services/user-position.service';
import { NotificationService } from '../../services/notification.service';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../model/task.model';
import {
  Notification,
  NotificationFilter,
} from '../../model/notification.model';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { getStatusIcon, formatTaskStatus } from '../../utils/task.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, TimeAgoPipe, MatIcon],
})
export class DashboardComponent implements OnInit {
  assignedTasks: Task[] = [];
  recentNotifications: Notification[] = [];
  isLoading = true;
  errorMessage = '';
  progressPercentage: number = 0;
  unreadCount = 0;
  currentLevel!: number;
  nextLevel!: number;
  positionDescription!: string;
  nextDescription!: string;
  public readonly defaultNotificationLimit = 3;

  openDropdownTaskId: number | null = null;
  availableStatuses = Object.values(TaskStatus).filter(
    (status) => status !== TaskStatus.DONE
  );
  updatingTaskId: number | null = null;
  navigatingToTask = false;
  formatTaskStatus = formatTaskStatus;

  constructor(
    private authService: AuthService,
    private userPositionService: UserPositionService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserPositions(userId);
    this.loadTasks(userId);
    this.loadNotifications(userId);
  }

  private loadUserPositions(userId: number): void {
    this.userPositionService.getUserPositions(userId).subscribe({
      next: (positions) => {
        if (positions.length > 0) {
          this.currentLevel = positions[0].currentLevel;
          this.nextLevel = positions[0].nextLevel;
          this.positionDescription = positions[0].description;
          this.nextDescription = positions[0].nextDescription;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user positions:', error);
        this.isLoading = false;
      },
    });
  }

  private loadTasks(userId: number): void {
    this.taskService.getTasksAssignedToUser(userId).subscribe({
      next: (response) => {
        const tasks = response.data.map((task) => ({
          ...task,
          status: task.status.toUpperCase() as TaskStatus,
        }));

        this.assignedTasks = tasks.filter(
          (task) => task.status !== TaskStatus.DONE
        );
        this.calculateProgress(tasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      },
    });
  }

  private loadNotifications(userId: number): void {
    this.notificationService
      .getNotifications(
        userId,
        NotificationFilter.UNREAD,
        0,
        this.defaultNotificationLimit
      )
      .subscribe({
        next: (apiResponse) => {
          if (apiResponse.success && apiResponse.data) {
            this.recentNotifications = apiResponse.data.data;
            this.unreadCount = this.recentNotifications.filter(
              (n) => !n.read
            ).length;
          } else {
            console.error('Error fetching notifications:', apiResponse.message);
            this.recentNotifications = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
          this.recentNotifications = [];
          this.isLoading = false;
        },
      });
  }

  private calculateProgress(tasks: Task[]): void {
    const inReviewCount = tasks.filter(
      (t) => t.status === TaskStatus.IN_REVIEW
    ).length;
    const todoCount = tasks.filter((t) => t.status === TaskStatus.TODO).length;
    const inProgressCount = tasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS
    ).length;

    const total = inReviewCount + todoCount + inProgressCount;
    const progressPercentage =
      total > 0 ? Math.round((inReviewCount / total) * 100) : 0;

    this.progressPercentage = progressPercentage;
  }

  getProgressBarStyle(): any {
    return {
      width: `${this.progressPercentage}%`,
    };
  }

  getNotificationIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      TASK: 'assignment',
      COMMENT: 'comment',
      PROMOTION: 'trending_up',
      MEETING: 'event',
      MESSAGE: 'message',
      ALERT: 'warning',
      REVIEW: 'rate_review',
      ERROR: 'error',
      FEEDBACK: 'feedback',
    };
    return iconMap[type] || 'notifications';
  }

  getTaskPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.DONE:
        return 'status-completed';
      case TaskStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TaskStatus.IN_REVIEW:
        return 'status-review';
      default:
        return 'status-pending';
    }
  }

  toggleStatusDropdown(taskId: number, event: Event): void {
    event.stopPropagation();
    if (this.updatingTaskId !== null) return;
    this.openDropdownTaskId =
      this.openDropdownTaskId === taskId ? null : taskId;
  }

  closeStatusDropdown(): void {
    this.openDropdownTaskId = null;
  }

  updateTaskStatus(taskId: number, newStatus: TaskStatus): void {
    if (this.updatingTaskId !== null) return;

    this.updatingTaskId = taskId;
    this.taskService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const taskIndex = this.assignedTasks.findIndex(
            (task) => task.id === taskId
          );
          if (taskIndex !== -1) {
            this.assignedTasks[taskIndex] = response.data;
            this.calculateProgress(this.assignedTasks);
          }
        }
        this.closeStatusDropdown();
        this.updatingTaskId = null;
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.updatingTaskId = null;
      },
    });
  }

  isDropdownOpen(taskId: number): boolean {
    return this.openDropdownTaskId === taskId;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (this.openDropdownTaskId !== null) {
      const dropdown = document.getElementById(
        `dropdown-${this.openDropdownTaskId}`
      );
      if (dropdown && !dropdown.contains(event.target as Node)) {
        this.closeStatusDropdown();
      }
    }
  }

  viewTaskDetails(taskId: number): void {
    if (this.navigatingToTask) return;

    this.navigatingToTask = true;
    try {
      this.router
        .navigate(['/task-view', taskId])
        .then(() => {
          this.navigatingToTask = false;
        })
        .catch(() => {
          this.navigatingToTask = false;
        });
    } catch (error) {
      console.error('Error navigating to task details:', error);
      this.navigatingToTask = false;
    }
  }
}
