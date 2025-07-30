import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import {
  Notification,
  NotificationFilter,
  NotificationType,
} from '../../model/notification.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginatedResponse } from '../../model/paginated-response.model';
import { NotificationFilterCountDTO } from '../../model/filter-count-dto.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginationService } from '../../services/pagination.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ApiResponse } from '../../model/api-response.model';

@Component({
  selector: 'app-notifications',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TimeAgoPipe,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PaginationComponent,
  ],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  userId!: number;
  selectedFilter: NotificationFilter = NotificationFilter.ALL;
  isLoading = false;
  errorMessage: string | null = null;
  availableFilters: NotificationFilter[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  filterCounts: NotificationFilterCountDTO[] = [];
  NotificationFilter = NotificationFilter;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
      this.loadAvailableFilters();
      this.loadFilterCounts();
      this.loadNotifications();

      this.paginationService.currentPage$.subscribe((page) => {
        this.currentPage = page;
        this.loadNotifications();
      });
    } else {
      this.errorMessage = 'No user is logged in';
    }
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.notificationService
      .getNotifications(
        this.userId,
        this.selectedFilter,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (response: ApiResponse<PaginatedResponse<Notification>>) => {
          this.notifications = response.data.data;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.page;
          this.pageSize = response.data.size;
          this.paginationService.setTotalPages(this.totalPages);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error:', err);
          this.errorMessage =
            err.error?.message || 'Failed to load notifications';
          this.isLoading = false;
        },
      });
  }

  loadAvailableFilters(): void {
    this.notificationService.getAvailableFilters(this.userId).subscribe({
      next: (response: ApiResponse<NotificationFilter[]>) => {
        if (response.success) {
          this.availableFilters = response.data;
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading available filters:', err);
      },
    });
  }

  loadFilterCounts(): void {
    this.notificationService.getFilterCounts(this.userId).subscribe({
      next: (response: ApiResponse<NotificationFilterCountDTO[]>) => {
        if (response.success) {
          this.filterCounts = response.data;
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading filter counts:', err);
      },
    });
  }

  setFilter(filter: NotificationFilter): void {
    this.selectedFilter = filter;
    this.currentPage = 0;
    this.paginationService.setCurrentPage(this.currentPage);
    this.loadNotifications();
  }

  setTypedFilter(filter: string): void {
    this.setFilter(filter as NotificationFilter);
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
        this.notificationService.updateUnreadCount(this.userId);
        this.loadFilterCounts();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error marking as read:', err);
      },
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.loadNotifications();
        this.notificationService.updateUnreadCount(this.userId);
        this.loadFilterCounts();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error marking all as read:', err);
      },
    });
  }

  getNotificationIcon(type: NotificationType): string {
    const iconMap: Record<NotificationType, string> = {
      [NotificationType.TASK]: 'assignment',
      [NotificationType.COMMENT]: 'comment',
      [NotificationType.PROMOTION]: 'trending_up',
      [NotificationType.MEETING]: 'event',
      [NotificationType.MESSAGE]: 'message',
      [NotificationType.ALERT]: 'warning',
      [NotificationType.REVIEW]: 'rate_review',
      [NotificationType.ERROR]: 'error',
      [NotificationType.FEEDBACK]: 'feedback',
    };
    const icon = iconMap[type] || 'notifications';
    return icon;
  }

  getTypeClass(type: NotificationType): string {
    return type;
  }

  getFilterIcon(filter: string): string {
    const notificationType = filter as NotificationType;
    return this.getNotificationIcon(notificationType);
  }
}
